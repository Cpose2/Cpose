
import React from 'react';
import { UserState } from '../types';
import { SHOP_ITEMS } from '../constants';
import { Trophy, Zap, Shield, Medal, Clock, Lock } from 'lucide-react';

interface ProfileProps {
  user: UserState;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const currentAvatarItem = SHOP_ITEMS.find(i => i.id === user.currentAvatar) || SHOP_ITEMS[0];
  
  // Calculate Badges based on stats
  const badges = [
    { id: 'novato', name: 'Novato', icon: '🌱', desc: 'Completa 1 nivel', unlocked: user.completedLevels.length >= 1 },
    { id: 'explorador', name: 'Explorador', icon: '🧭', desc: 'Desbloquea Mundo 2', unlocked: user.completedLevels.some(l => l >= 200) },
    { id: 'rico', name: 'Magnate', icon: '💰', desc: 'Ten 500 monedas', unlocked: user.coins >= 500 },
    { id: 'maestro', name: 'Hacker', icon: '💻', desc: 'Llega al nivel 5', unlocked: user.level >= 5 },
    { id: 'coleccionista', name: 'Fashion', icon: '🎩', desc: 'Ten 3 skins', unlocked: user.unlockedSkins.length >= 3 },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-brand-dark pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row items-center gap-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative">
                <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center text-7xl border-4 border-brand-gold shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                    {currentAvatarItem.emoji}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-brand-dark px-3 py-1 rounded-full border border-white/20 text-xs font-bold">
                    Lvl {user.level}
                </div>
            </div>

            <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">Cadete Espacial</h1>
                <p className="text-slate-400 mb-4">"El código es fuerte en este."</p>
                
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                        className="h-full bg-gradient-to-r from-brand-primary to-brand-accent"
                        style={{ width: `${Math.min(100, (user.xp % 1000) / 10)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-black drop-shadow-md">
                        {user.xp} / {Math.max(1000, Math.ceil((user.xp + 1)/1000)*1000)} XP
                    </span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><Zap size={24} /></div>
                <div>
                    <p className="text-slate-400 text-xs uppercase font-bold">Niveles</p>
                    <p className="text-2xl font-bold text-white">{user.completedLevels.length}</p>
                </div>
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-brand-gold/20 text-brand-gold rounded-xl"><Clock size={24} /></div>
                <div>
                    <p className="text-slate-400 text-xs uppercase font-bold">Horas Código</p>
                    <p className="text-2xl font-bold text-white">12.5</p>
                </div>
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-brand-accent/20 text-brand-accent rounded-xl"><Shield size={24} /></div>
                <div>
                    <p className="text-slate-400 text-xs uppercase font-bold">Racha</p>
                    <p className="text-2xl font-bold text-white">3 Días</p>
                </div>
            </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Medal className="text-brand-gold" />
            Logros & Medallas
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(badge => (
                <div 
                    key={badge.id} 
                    className={`
                        p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all
                        ${badge.unlocked 
                            ? 'bg-slate-800 border-brand-primary/30 text-white' 
                            : 'bg-slate-900/50 border-white/5 text-slate-600 grayscale opacity-60'
                        }
                    `}
                >
                    <div className="text-4xl mb-1">{badge.icon}</div>
                    <h3 className="font-bold text-sm">{badge.name}</h3>
                    <p className="text-[10px] text-slate-400 leading-tight">{badge.desc}</p>
                    {badge.unlocked ? <span className="text-[10px] text-green-400 font-bold">DESBLOQUEADO</span> : <Lock size={12} />}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
