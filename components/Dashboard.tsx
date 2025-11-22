import React, { useEffect, useState } from 'react';
import { UserState } from '../types';
import { generateDailyChallengeDescription } from '../services/geminiService';
import { Zap, Trophy, Target, Clock } from 'lucide-react';

interface DashboardProps {
  user: UserState;
  onPlay: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onPlay }) => {
  const [dailyChallenge, setDailyChallenge] = useState<{title: string, task: string} | null>(null);

  useEffect(() => {
    generateDailyChallengeDescription().then(setDailyChallenge);
  }, []);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-brand-dark pb-24">
      {/* Welcome Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-light text-white">Bienvenido,</h1>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
                Cadete
            </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            <span className="text-2xl">🤖</span>
            <div className="flex flex-col">
                <span className="text-xs text-slate-400">Nivel {user.level}</span>
                <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold w-3/4"></div>
                </div>
            </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-white/5 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-gold/20 rounded-lg text-brand-gold"><Zap size={20} /></div>
                <span className="text-slate-400 text-sm">XP Total</span>
            </div>
            <span className="text-2xl font-bold">{user.xp}</span>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-white/5 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-accent/20 rounded-lg text-brand-accent"><Trophy size={20} /></div>
                <span className="text-slate-400 text-sm">Insignias</span>
            </div>
            <span className="text-2xl font-bold">{Math.floor(user.completedLevels.length / 5)}</span>
        </div>
      </div>

      {/* Daily Challenge Card */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-1 rounded-2xl shadow-xl shadow-brand-primary/20 mb-8 transform transition hover:scale-[1.01] cursor-pointer group">
        <div className="bg-slate-900 rounded-xl p-5 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock size={100} />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <span className="bg-brand-gold/20 text-brand-gold text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Misión Diaria</span>
                    <span className="text-slate-400 text-xs">Reinicia en 4h</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                    {dailyChallenge ? dailyChallenge.title : "Descifrando señal..."}
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                    {dailyChallenge ? dailyChallenge.task : "Espera mientras obtenemos el reto de hoy."}
                </p>

                <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition">
                    Aceptar Reto (+50 XP)
                </button>
            </div>
        </div>
      </div>

      {/* Quick Start */}
      <button 
        onClick={onPlay}
        className="w-full bg-gradient-to-r from-brand-accent to-blue-600 p-4 rounded-2xl font-bold text-xl text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
      >
        <Target className="animate-pulse" />
        CONTINUAR VIAJE
      </button>
    </div>
  );
};