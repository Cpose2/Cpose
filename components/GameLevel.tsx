
import React, { useState, useEffect, useRef } from 'react';
import { LevelData, Command, CommandType } from '../types';
import { COMMANDS_DB, AVATARS_DB } from '../constants';
import { Play, RotateCcw, ArrowUp, Zap, HelpCircle, ArrowLeft, CheckCircle, XCircle, ChevronsUp, RotateCw, RotateCcw as RotateCcwIcon } from 'lucide-react';
import { getAiHint } from '../services/geminiService';

interface GameLevelProps {
  levelData: LevelData;
  onComplete: (stars: number) => void;
  onBack: () => void;
  userAvatarId: string; // Nuevo prop
}

const uid = () => Math.random().toString(36).substr(2, 9);

export const GameLevel: React.FC<GameLevelProps> = ({ levelData, onComplete, onBack, userAvatarId }) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [robotState, setRobotState] = useState({ ...levelData.startPos });
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'RUNNING' | 'WON' | 'LOST'>('IDLE');
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const resetLevel = () => {
    setRobotState({ ...levelData.startPos });
    setGameStatus('IDLE');
    setIsPlaying(false);
    setFailureReason(null);
  };

  useEffect(() => {
    resetLevel();
    setCommands([]);
    setAiHint(null);
    setAttempts(0);
  }, [levelData]);

  const addCommand = (type: CommandType) => {
    if (gameStatus === 'RUNNING') return;
    const cmdDef = COMMANDS_DB[type];
    setCommands([...commands, { ...cmdDef, id: uid() }]);
  };

  const removeCommand = (id: string) => {
    if (gameStatus === 'RUNNING') return;
    setCommands(commands.filter(c => c.id !== id));
  };

  const validateAndMove = (currentX: number, currentY: number, dir: string, steps: number = 1): { x: number, y: number, crashed: boolean, reason?: string } => {
      let newX = currentX;
      let newY = currentY;

      for(let i=0; i<steps; i++) {
          let nextX = newX;
          let nextY = newY;

          if (dir === 'N') nextY = newY - 1;
          if (dir === 'S') nextY = newY + 1;
          if (dir === 'E') nextX = newX + 1;
          if (dir === 'W') nextX = newX - 1;

          if (nextX < 0 || nextX >= levelData.gridSize || nextY < 0 || nextY >= levelData.gridSize) {
              return { x: newX, y: newY, crashed: true, reason: "¡Te saliste del mapa!" };
          }

          const isBlocked = levelData.obstacles.some(obs => obs.x === nextX && obs.y === nextY);
          if (isBlocked) {
              return { x: newX, y: newY, crashed: true, reason: "¡Chocaste contra un muro!" };
          }

          newX = nextX;
          newY = nextY;
      }

      return { x: newX, y: newY, crashed: false };
  };

  useEffect(() => {
    if (!isPlaying) return;

    let step = 0;
    const interval = setInterval(() => {
      if (gameStatus === 'LOST' || gameStatus === 'WON') {
          clearInterval(interval);
          setIsPlaying(false);
          return;
      }

      if (step >= commands.length) {
        setIsPlaying(false);
        checkFinalCondition();
        clearInterval(interval);
        return;
      }

      const cmd = commands[step];
      executeCommand(cmd);
      step++;
    }, 600);

    return () => clearInterval(interval);
  }, [isPlaying, commands, gameStatus]);

  const executeCommand = (cmd: Command) => {
    setRobotState(prev => {
      let { x, y, dir } = prev;
      
      if (cmd.type === CommandType.MOVE_FORWARD) {
          const result = validateAndMove(x, y, dir, 1);
          if (result.crashed) {
              triggerDefeat(result.reason || "Error de movimiento");
              return prev; 
          }
          x = result.x;
          y = result.y;
      } else if (cmd.type === CommandType.MOVE_THREE) {
          const result = validateAndMove(x, y, dir, 3);
          if (result.crashed) {
              triggerDefeat(result.reason || "Error en el bucle");
              return { ...prev, x: result.x, y: result.y };
          }
          x = result.x;
          y = result.y;
      } else if (cmd.type === CommandType.TURN_LEFT) {
        const dirs = ['N', 'E', 'S', 'W'];
        const idx = dirs.indexOf(dir);
        dir = dirs[(idx - 1 + 4) % 4] as any;
      } else if (cmd.type === CommandType.TURN_RIGHT) {
        const dirs = ['N', 'E', 'S', 'W'];
        const idx = dirs.indexOf(dir);
        dir = dirs[(idx + 1) % 4] as any;
      }

      return { x, y, dir };
    });
  };

  const triggerDefeat = (reason: string) => {
      setFailureReason(reason);
      setGameStatus('LOST');
      setIsPlaying(false);
      setAttempts(a => a + 1);
  };

  const checkFinalCondition = () => {
    setRobotState(current => {
        if (current.x === levelData.goalPos.x && current.y === levelData.goalPos.y) {
            setGameStatus('WON');
        } else {
            triggerDefeat("El algoritmo terminó, pero no llegaste a la meta.");
        }
        return current;
    })
  };

  const handleRun = () => {
    if (commands.length === 0) return;
    resetLevel();
    setTimeout(() => {
        setIsPlaying(true);
        setGameStatus('RUNNING');
        setAiHint(null);
    }, 100);
  };

  const handleAskAI = async () => {
    setLoadingHint(true);
    const hint = await getAiHint(levelData, commands, attempts);
    setAiHint(hint);
    setLoadingHint(false);
  };

  const renderGrid = () => {
    const cells = [];
    // Obtener emoji del avatar actual o usar fallback
    const avatarEmoji = AVATARS_DB[userAvatarId] || AVATARS_DB['DEFAULT'];

    for (let y = 0; y < levelData.gridSize; y++) {
      for (let x = 0; x < levelData.gridSize; x++) {
        const isRobot = robotState.x === x && robotState.y === y;
        const isGoal = levelData.goalPos.x === x && levelData.goalPos.y === y;
        const isObstacle = levelData.obstacles.some(o => o.x === x && o.y === y);

        let content = null;
        if (isRobot) {
            content = (
                <div 
                    className="text-3xl transition-transform duration-300 z-10"
                    style={{ 
                        transform: `rotate(${robotState.dir === 'E' ? 0 : robotState.dir === 'S' ? 90 : robotState.dir === 'W' ? 180 : -90}deg)` 
                    }}
                >
                    {avatarEmoji}
                </div>
            );
        } else if (isGoal) {
            content = <div className="text-2xl animate-pulse">🔋</div>;
        } else if (isObstacle) {
            content = <div className="text-xl opacity-80">🧱</div>;
        }

        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={`
                border border-brand-dark/20 flex items-center justify-center relative
                ${(x + y) % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}
                ${isRobot ? 'shadow-[0_0_15px_rgba(99,102,241,0.5)]' : ''}
            `}
            style={{ aspectRatio: '1/1' }}
          >
            {content}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden relative">
      <header className="bg-brand-primary p-4 flex justify-between items-center shrink-0 z-10 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
            <h2 className="text-lg font-bold">{levelData.title}</h2>
            <p className="text-xs text-white/70">{levelData.description}</p>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 bg-brand-dark relative flex flex-col items-center justify-center p-4 overflow-y-auto">
             
            {(gameStatus === 'WON' || gameStatus === 'LOST') && (
                <div className="absolute inset-0 z-50 bg-brand-dark/80 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-slate-900 p-8 rounded-2xl text-center border-2 border-white/10 shadow-2xl max-w-md w-full animate-[scale-in_0.3s_ease-out]">
                        {gameStatus === 'WON' ? (
                            <>
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">¡Misión Cumplida!</h2>
                                <p className="text-green-300 font-bold text-lg mb-4">{levelData.successMessage || "Has completado el nivel."}</p>
                                {levelData.learnConcept && (
                                    <div className="bg-white/5 p-4 rounded-lg text-left mb-6 border-l-4 border-brand-accent">
                                        <p className="text-xs text-brand-accent uppercase font-bold mb-1">Lección Aprendida:</p>
                                        <p className="text-sm text-slate-300">{levelData.learnConcept}</p>
                                    </div>
                                )}
                                <div className="flex items-center justify-center gap-2 mb-4 text-brand-gold bg-brand-gold/10 p-2 rounded-lg">
                                    <span>+50 XP</span>
                                    <span>+25 🪙</span>
                                </div>
                                <button 
                                    onClick={() => onComplete(3)}
                                    className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white transition"
                                >
                                    Continuar
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
                                    <XCircle size={48} />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">¡Algo falló!</h2>
                                <p className="text-red-300 text-lg mb-4 font-medium">{failureReason}</p>
                                <div className="bg-white/5 p-4 rounded-lg mb-6 text-sm text-slate-400">
                                    Recuerda: La programación es prueba y error. Revisa tu secuencia y vuelve a intentar.
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={resetLevel}
                                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-white transition"
                                    >
                                        Reintentar
                                    </button>
                                    <button 
                                        onClick={handleAskAI}
                                        className="px-4 py-3 bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 rounded-xl font-bold transition"
                                    >
                                        Pedir Pista
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
             )}

             {levelData.tutorialText && attempts === 0 && commands.length === 0 && gameStatus === 'IDLE' && (
                <div className="absolute top-4 left-4 right-4 bg-brand-primary/90 p-4 rounded-xl border border-white/20 z-20 animate-float shadow-lg max-w-lg mx-auto">
                    <div className="flex gap-3">
                        <span className="text-2xl">💡</span>
                        <p className="text-sm leading-relaxed">{levelData.tutorialText}</p>
                    </div>
                </div>
            )}

            {aiHint && (
                <div className="absolute bottom-4 left-4 right-4 bg-brand-accent/90 text-brand-dark p-4 rounded-xl border border-white/40 z-20 shadow-xl max-w-lg mx-auto">
                    <div className="flex gap-3 items-start">
                        <span className="text-2xl">🤖</span>
                        <div>
                            <p className="font-bold text-xs uppercase mb-1 opacity-70">Consejo del Tutor IA</p>
                            <p className="text-sm font-medium">{aiHint}</p>
                        </div>
                        <button onClick={() => setAiHint(null)} className="ml-auto text-lg font-bold px-2 hover:text-white">&times;</button>
                    </div>
                </div>
            )}

            <div 
                className="grid gap-1 bg-slate-800 p-2 rounded-lg border-4 border-brand-dark shadow-2xl relative"
                style={{ 
                    gridTemplateColumns: `repeat(${levelData.gridSize}, minmax(0, 1fr))`,
                    width: '100%',
                    maxWidth: '420px',
                    aspectRatio: '1/1'
                }}
            >
                <div className="absolute inset-0 pointer-events-none border border-white/5 z-0"></div>
                {renderGrid()}
            </div>
        </div>

        <div className="lg:w-96 bg-slate-900 flex flex-col border-l border-white/10 shadow-xl z-20">
            <div className="p-4 bg-slate-900 border-b border-white/10 grid grid-cols-3 gap-2">
                 {levelData.availableCommands.map(cmdType => {
                     const def = COMMANDS_DB[cmdType];
                     
                     let IconComp = ArrowUp;
                     if(def.type === CommandType.TURN_LEFT) IconComp = RotateCcwIcon;
                     if(def.type === CommandType.TURN_RIGHT) IconComp = RotateCw; 
                     if(def.type === CommandType.ACTION) IconComp = Zap;
                     if(def.type === CommandType.MOVE_THREE) IconComp = ChevronsUp;

                     return (
                         <button
                            key={cmdType}
                            onClick={() => addCommand(cmdType)}
                            disabled={gameStatus === 'RUNNING'}
                            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-brand-primary hover:text-white text-slate-300 rounded-lg border border-slate-700 hover:border-brand-primary transition-all active:scale-95 disabled:opacity-50"
                         >
                             <IconComp size={24} className={def.type === CommandType.TURN_RIGHT ? "" : ""} strokeWidth={1.5} />
                             <span className="text-[10px] mt-1 font-bold uppercase">{def.label}</span>
                         </button>
                     )
                 })}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-black/20">
                <div className="flex justify-between items-center mb-2 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <span>Algoritmo Principal</span>
                    <span>{commands.length} Bloques</span>
                </div>
                
                {commands.length === 0 && (
                    <div className="h-40 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 gap-2 p-6 text-center">
                        <ArrowUp className="animate-bounce opacity-50" />
                        <p className="text-sm">Toca los botones de arriba para añadir instrucciones.</p>
                    </div>
                )}

                {commands.map((cmd, index) => (
                    <div key={cmd.id} className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-sm group animate-in slide-in-from-bottom-2 duration-300">
                        <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-xs font-mono text-slate-500 border border-slate-600">
                            {index + 1}
                        </div>
                        <span className="font-medium text-sm text-slate-200 flex-1">{cmd.label}</span>
                        <button 
                            onClick={() => removeCommand(cmd.id)}
                            disabled={gameStatus === 'RUNNING'}
                            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <XCircle size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-900 border-t border-white/10 flex gap-3">
                <button 
                    onClick={handleAskAI}
                    disabled={loadingHint || gameStatus === 'WON'}
                    className="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 p-3 rounded-xl flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition disabled:opacity-50"
                    title="Pedir Pista"
                >
                    {loadingHint ? <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" /> : <HelpCircle size={24} />}
                </button>

                <button 
                    onClick={handleRun}
                    disabled={commands.length === 0 || gameStatus === 'RUNNING'}
                    className={`
                        flex-1 py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                        ${gameStatus === 'RUNNING' 
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                            : 'bg-brand-primary hover:bg-brand-secondary hover:-translate-y-1 shadow-brand-primary/30'
                        }
                    `}
                >
                    {gameStatus === 'RUNNING' ? 'Procesando...' : <><Play fill="currentColor" size={20} /> EJECUTAR</>}
                </button>
                 
                <button 
                    onClick={resetLevel}
                    className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700"
                    title="Reiniciar Nivel"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
