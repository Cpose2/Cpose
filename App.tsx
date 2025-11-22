
import React, { useState } from 'react';
import { Screen, UserState, LevelData, ShopItem } from './types';
import { Dashboard } from './components/Dashboard';
import { WorldMap } from './components/WorldMap';
import { GameLevel } from './components/GameLevel';
import { Shop } from './components/Shop';
import { Profile } from './components/Profile';
import { Home, Map as MapIcon, User, Settings, ShoppingBag } from 'lucide-react';

const INITIAL_USER: UserState = {
  xp: 1250,
  level: 3,
  coins: 450, // Monedas iniciales para probar la tienda
  completedLevels: [101], 
  currentAvatar: 'DEFAULT',
  unlockedSkins: ['DEFAULT'],
};

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.HOME);
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [user, setUser] = useState<UserState>(INITIAL_USER);

  const handleLevelSelect = (level: LevelData) => {
    setCurrentLevel(level);
    setScreen(Screen.GAME_LEVEL);
  };

  const handleLevelComplete = (stars: number) => {
    if (currentLevel) {
        const xpGain = stars * 50;
        const coinGain = 25;
        setUser(prev => ({
            ...prev,
            xp: prev.xp + xpGain,
            coins: prev.coins + coinGain,
            completedLevels: Array.from(new Set([...prev.completedLevels, currentLevel.id]))
        }));
    }
    setScreen(Screen.MAP);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (user.coins >= item.price && !user.unlockedSkins.includes(item.id)) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins - item.price,
        unlockedSkins: [...prev.unlockedSkins, item.id]
      }));
    }
  };

  const handleEquipItem = (item: ShopItem) => {
    if (user.unlockedSkins.includes(item.id)) {
      setUser(prev => ({
        ...prev,
        currentAvatar: item.id
      }));
    }
  };

  // Mobile Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 p-4 pb-6 flex justify-around z-50 lg:hidden">
        <NavButton icon={Home} label="Inicio" isActive={screen === Screen.DASHBOARD || screen === Screen.HOME} onClick={() => setScreen(Screen.DASHBOARD)} />
        <NavButton icon={MapIcon} label="Mapa" isActive={screen === Screen.MAP} onClick={() => setScreen(Screen.MAP)} />
        <NavButton icon={ShoppingBag} label="Tienda" isActive={screen === Screen.SHOP} onClick={() => setScreen(Screen.SHOP)} />
        <NavButton icon={User} label="Perfil" isActive={screen === Screen.PROFILE} onClick={() => setScreen(Screen.PROFILE)} />
    </div>
  );

  // Desktop Sidebar
  const Sidebar = () => (
    <div className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-white/10 p-6">
        <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-2xl">
                🚀
            </div>
            <h1 className="font-bold text-xl tracking-wider">CodeQuest</h1>
        </div>

        <nav className="space-y-2 flex-1">
            <NavButtonRow icon={Home} label="Tablero" isActive={screen === Screen.DASHBOARD} onClick={() => setScreen(Screen.DASHBOARD)} />
            <NavButtonRow icon={MapIcon} label="Misiones" isActive={screen === Screen.MAP} onClick={() => setScreen(Screen.MAP)} />
            <NavButtonRow icon={ShoppingBag} label="Taller" isActive={screen === Screen.SHOP} onClick={() => setScreen(Screen.SHOP)} />
            <NavButtonRow icon={User} label="Mi Piloto" isActive={screen === Screen.PROFILE} onClick={() => setScreen(Screen.PROFILE)} />
        </nav>

        <div className="pt-6 border-t border-white/10">
            <NavButtonRow icon={Settings} label="Ajustes" isActive={false} onClick={() => {}} />
        </div>
    </div>
  );

  if (screen === Screen.HOME) {
      return (
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-brand-dark relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-brand-dark to-brand-dark z-0"></div>
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-brand-secondary/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

              <div className="z-10 text-center space-y-8">
                  <div className="animate-float">
                      <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)] border-t border-white/20">
                        <span className="text-5xl">🚀</span>
                      </div>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">CodeQuest</h1>
                    <p className="text-brand-accent/80 font-mono text-sm">v1.0.0 // SISTEMA LISTO</p>
                  </div>

                  <button 
                    onClick={() => setScreen(Screen.DASHBOARD)}
                    className="px-12 py-4 bg-white text-brand-dark font-bold rounded-full hover:scale-105 transition duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    INICIALIZAR
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="flex h-screen bg-brand-dark text-white font-sans">
      {screen !== Screen.GAME_LEVEL && <Sidebar />}
      
      <main className="flex-1 flex flex-col relative max-h-screen w-full">
        {screen === Screen.DASHBOARD && <Dashboard user={user} onPlay={() => setScreen(Screen.MAP)} />}
        
        {screen === Screen.MAP && (
            <WorldMap 
                completedLevels={user.completedLevels} 
                unlockedWorlds={[1, 2, 3, 4]} 
                onSelectLevel={handleLevelSelect} 
            />
        )}
        
        {screen === Screen.SHOP && (
            <Shop user={user} onBuy={handleBuyItem} onEquip={handleEquipItem} />
        )}

        {screen === Screen.PROFILE && (
            <Profile user={user} />
        )}

        {screen === Screen.GAME_LEVEL && currentLevel && (
            <GameLevel 
                levelData={currentLevel} 
                onComplete={handleLevelComplete} 
                onBack={() => setScreen(Screen.MAP)} 
                userAvatarId={user.currentAvatar}
            />
        )}
      </main>
      
      {screen !== Screen.GAME_LEVEL && <BottomNav />}
    </div>
  );
}

const NavButton = ({icon: Icon, label, isActive, onClick}: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-accent' : 'text-slate-500'}`}
    >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

const NavButtonRow = ({icon: Icon, label, isActive, onClick}: any) => (
    <button 
        onClick={onClick}
        className={`
            w-full flex items-center gap-4 p-3 rounded-xl transition-all
            ${isActive ? 'bg-brand-primary/20 text-brand-accent border border-brand-primary/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
        `}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
);
