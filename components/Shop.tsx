
import React from 'react';
import { UserState, ShopItem } from '../types';
import { SHOP_ITEMS } from '../constants';
import { ShoppingBag, Lock, Check } from 'lucide-react';

interface ShopProps {
  user: UserState;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

export const Shop: React.FC<ShopProps> = ({ user, onBuy, onEquip }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-brand-dark pb-24">
      <header className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">
                Taller Mecánico
            </h1>
            <p className="text-slate-400">Mejora tu chasis con skins exclusivos.</p>
        </div>
        <div className="bg-slate-800 border border-brand-gold/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span className="text-2xl">🪙</span>
            <span className="text-xl font-bold text-brand-gold">{user.coins}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOP_ITEMS.map((item) => {
            const isUnlocked = user.unlockedSkins.includes(item.id);
            const isEquipped = user.currentAvatar === item.id;
            const canAfford = user.coins >= item.price;

            return (
                <div 
                    key={item.id} 
                    className={`
                        relative bg-slate-800 rounded-2xl p-6 border transition-all group
                        ${isEquipped ? 'border-brand-primary ring-2 ring-brand-primary/50 bg-brand-primary/5' : 'border-white/10 hover:border-white/30'}
                    `}
                >
                    <div className="absolute top-4 right-4">
                        {isEquipped && <div className="bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded">EQUIPADO</div>}
                    </div>

                    <div className={`text-6xl mb-4 transform transition-transform group-hover:scale-110 ${item.color} drop-shadow-lg text-center`}>
                        {item.emoji}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-400 mb-4 h-10">{item.description}</p>

                    <div className="mt-auto">
                        {isUnlocked ? (
                            <button 
                                onClick={() => onEquip(item)}
                                disabled={isEquipped}
                                className={`
                                    w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2
                                    ${isEquipped 
                                        ? 'bg-slate-700 text-slate-500 cursor-default' 
                                        : 'bg-brand-secondary hover:bg-brand-primary text-white'
                                    }
                                `}
                            >
                                {isEquipped ? <><Check size={18} /> En uso</> : 'Equipar'}
                            </button>
                        ) : (
                            <button 
                                onClick={() => onBuy(item)}
                                disabled={!canAfford}
                                className={`
                                    w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2
                                    ${canAfford 
                                        ? 'bg-brand-gold hover:bg-yellow-400 text-brand-dark' 
                                        : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                                    }
                                `}
                            >
                                {canAfford ? (
                                    <>Comprar por {item.price} 🪙</>
                                ) : (
                                    <><Lock size={16} /> Necesitas {item.price} 🪙</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};
