
export enum Screen {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  MAP = 'MAP',
  GAME_LEVEL = 'GAME_LEVEL',
  PROFILE = 'PROFILE',
  SHOP = 'SHOP'
}

export enum CommandType {
  MOVE_FORWARD = 'MOVE_FORWARD',
  MOVE_BACKWARD = 'MOVE_BACKWARD',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  ACTION = 'ACTION',
  LOOP = 'LOOP', 
  MOVE_THREE = 'MOVE_THREE' 
}

export interface Command {
  id: string;
  type: CommandType;
  label: string;
  icon: string;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  worldId: number;
  gridSize: number;
  startPos: { x: number; y: number; dir: 'N' | 'E' | 'S' | 'W' };
  goalPos: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  availableCommands: CommandType[];
  optimalSteps: number;
  tutorialText?: string;
  successMessage?: string; 
  learnConcept?: string;   
}

export interface World {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  isLocked: boolean;
  levels: LevelData[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string; // Representación visual simple
  color: string;
}

export interface UserState {
  xp: number;
  level: number;
  coins: number;
  completedLevels: number[];
  currentAvatar: string; // ID del item de la tienda
  unlockedSkins: string[]; // IDs de los items comprados
}
