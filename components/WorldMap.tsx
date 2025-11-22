import React from 'react';
import { WORLDS } from '../constants';
import { Lock, Star, MapPin } from 'lucide-react';
import { World, LevelData } from '../types';

interface WorldMapProps {
  onSelectLevel: (level: LevelData) => void;
  completedLevels: number[];
  unlockedWorlds: number[];
}

export const WorldMap: React.FC<WorldMapProps> = ({ onSelectLevel, completedLevels, unlockedWorlds }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 pb-24 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">
        Mapa de Exploración
      </h1>

      <div className="max-w-2xl mx-auto space-y-12 relative">
        {/* Connecting Line (Visual Only) */}
        <div className="absolute left-8 top-10 bottom-10 w-1 bg-slate-700 rounded-full -z-10"></div>

        {WORLDS.map((world, index) => (
          <div key={world.id} className={`relative pl-20 transition-all duration-500 ${index % 2 === 0 ? 'translate-x-0' : 'translate-x-0'}`}>
             {/* World Node Marker */}
             <div className={`
                absolute left-4 top-0 w-9 h-9 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center
                ${world.isLocked ? 'bg-slate-600' : `bg-gradient-to-br ${world.color} shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
             `}>
                {world.isLocked ? <Lock size={14} /> : <span className="text-xs font-bold">{world.id}</span>}
             </div>

            <div className={`
                bg-slate-800/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all hover:border-brand-primary/50
                ${world.isLocked ? 'opacity-60 grayscale' : 'hover:scale-[1.02] shadow-xl'}
            `}>
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className={`text-xl font-bold bg-gradient-to-r ${world.color} bg-clip-text text-transparent`}>
                        {world.name}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">{world.description}</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded-lg">
                    {/* Icon placeholder based on World Data */}
                    <MapPin className={world.isLocked ? "text-slate-600" : "text-brand-accent"} />
                </div>
              </div>

              {/* Levels List */}
              {!world.isLocked && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                    {world.levels.map((level) => {
                        const isCompleted = completedLevels.includes(level.id);
                        return (
                            <button
                                key={level.id}
                                onClick={() => onSelectLevel(level)}
                                className={`
                                    aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all
                                    ${isCompleted 
                                        ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' 
                                        : 'bg-slate-700 border-transparent hover:bg-slate-600 hover:border-white/20'
                                    }
                                `}
                            >
                                <span className="text-lg font-bold">{level.id % 100}</span>
                                {isCompleted && <Star size={12} fill="currentColor" />}
                            </button>
                        )
                    })}
                    {world.levels.length === 0 && (
                        <div className="col-span-full text-center text-xs text-slate-500 italic py-2">
                            En Construcción
                        </div>
                    )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};