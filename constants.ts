
import { CommandType, World, ShopItem } from './types';

export const AVATARS_DB: Record<string, string> = {
  'DEFAULT': '🤖',
  'SPEEDY': '🏎️',
  'TANK': '🚜',
  'ALIEN': '👽',
  'GHOST': '👻',
  'NINJA': '🥷',
  'CAT': '🐱',
  'WIZARD': '🧙‍♂️'
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'DEFAULT', name: 'Unidad MK-1', description: 'El modelo estándar confiable.', price: 0, emoji: '🤖', color: 'text-slate-400' },
  { id: 'SPEEDY', name: 'Turbo Racer', description: 'Aerodinámico y rápido (en espíritu).', price: 150, emoji: '🏎️', color: 'text-red-500' },
  { id: 'TANK', name: 'Excavadora', description: 'Perfecto para obras pesadas.', price: 300, emoji: '🚜', color: 'text-yellow-500' },
  { id: 'ALIEN', name: 'Xenomorfo', description: 'Tecnología de otra galaxia.', price: 500, emoji: '👽', color: 'text-green-400' },
  { id: 'GHOST', name: 'Spectre', description: 'Atraviesa... bueno, no atraviesa paredes aún.', price: 750, emoji: '👻', color: 'text-purple-300' },
  { id: 'NINJA', name: 'Sombra', description: 'Silencioso y letal.', price: 1000, emoji: '🥷', color: 'text-slate-800' },
  { id: 'CAT', name: 'Mecha-Gato', description: 'Tiene 9 vidas (intentos).', price: 1500, emoji: '🐱', color: 'text-orange-400' },
  { id: 'WIZARD', name: 'Mago de Código', description: 'Compila hechizos mágicos.', price: 2500, emoji: '🧙‍♂️', color: 'text-indigo-400' },
];

export const COMMANDS_DB = {
  [CommandType.MOVE_FORWARD]: { type: CommandType.MOVE_FORWARD, label: 'Avanzar', icon: 'ArrowUp' },
  [CommandType.MOVE_BACKWARD]: { type: CommandType.MOVE_BACKWARD, label: 'Retroceder', icon: 'ArrowDown' },
  [CommandType.TURN_LEFT]: { type: CommandType.TURN_LEFT, label: 'Girar Izq', icon: 'RotateCcw' },
  [CommandType.TURN_RIGHT]: { type: CommandType.TURN_RIGHT, label: 'Girar Der', icon: 'RotateCw' },
  [CommandType.ACTION]: { type: CommandType.ACTION, label: 'Activar', icon: 'Zap' },
  [CommandType.MOVE_THREE]: { type: CommandType.MOVE_THREE, label: 'Avanzar x3', icon: 'ChevronsUp' },
};

export const WORLDS: World[] = [
  {
    id: 1,
    name: 'Archipiélago Algoritmo',
    description: 'Aprende los conceptos básicos de secuencias y lógica paso a paso.',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Map',
    isLocked: false,
    levels: [
      {
        id: 101,
        worldId: 1,
        title: 'Primeros Pasos',
        description: 'Guía al robot hacia la batería usando movimientos simples.',
        gridSize: 5,
        startPos: { x: 0, y: 0, dir: 'E' },
        goalPos: { x: 3, y: 0 },
        obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
        availableCommands: [CommandType.MOVE_FORWARD],
        optimalSteps: 3,
        tutorialText: "Un **algoritmo** es una serie ordenada de instrucciones. Para llegar a la meta, simplemente dile al robot que avance.",
        successMessage: "¡Excelente! Has creado tu primer algoritmo secuencial.",
        learnConcept: "En programación, el orden de los factores SÍ altera el producto. Las instrucciones se ejecutan una tras otra."
      },
      {
        id: 102,
        worldId: 1,
        title: 'Girando la Esquina',
        description: 'Aprende a cambiar de dirección.',
        gridSize: 5,
        startPos: { x: 0, y: 0, dir: 'E' },
        goalPos: { x: 2, y: 2 },
        obstacles: [{ x: 0, y: 1 }, { x: 3, y: 0 }, { x: 1, y: 1 }],
        availableCommands: [CommandType.MOVE_FORWARD, CommandType.TURN_RIGHT],
        optimalSteps: 5,
        tutorialText: "A veces el camino no es recto. Usa 'Girar Der' para cambiar la orientación del robot 90 grados.",
        successMessage: "¡Bien hecho! Entender la orientación es clave en robótica y gráficos.",
        learnConcept: "El cambio de estado (como la dirección) afecta a todas las instrucciones futuras."
      },
      {
        id: 103,
        worldId: 1,
        title: 'El Zig-Zag',
        description: 'Combina giros a izquierda y derecha.',
        gridSize: 6,
        startPos: { x: 0, y: 2, dir: 'E' },
        goalPos: { x: 4, y: 2 },
        obstacles: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 1, y: 3 }, { x: 3, y: 1 }],
        availableCommands: [CommandType.MOVE_FORWARD, CommandType.TURN_LEFT, CommandType.TURN_RIGHT],
        optimalSteps: 8,
        tutorialText: "Tendrás que rodear los obstáculos. Planifica tu ruta antes de empezar a colocar bloques.",
        successMessage: "¡Dominas el movimiento básico!",
        learnConcept: "La depuración (debugging) mental consiste en imaginar el camino antes de escribir el código."
      },
      {
        id: 104,
        worldId: 1,
        title: 'Retorno a Casa',
        description: 'Avanza y regresa.',
        gridSize: 5,
        startPos: { x: 2, y: 2, dir: 'N' },
        goalPos: { x: 2, y: 4 },
        obstacles: [{x: 1, y: 3}, {x: 3, y: 3}],
        availableCommands: [CommandType.MOVE_FORWARD, CommandType.TURN_RIGHT, CommandType.TURN_LEFT],
        optimalSteps: 6,
        tutorialText: "A veces hay que dar la vuelta completa (180 grados) para regresar. Eso son dos giros de 90 grados.",
        successMessage: "¡Navegación espacial completada!",
        learnConcept: "Girar dos veces a la derecha equivale a un giro de 180 grados."
      }
    ]
  },
  {
    id: 2,
    name: 'Valle de Variables',
    description: 'Almacena y recupera datos en contenedores de memoria.',
    color: 'from-purple-500 to-pink-500',
    icon: 'Database',
    isLocked: false,
    levels: [
      {
        id: 201,
        worldId: 2,
        title: 'Bancos de Memoria',
        description: 'Recoge los orbes de energía.',
        gridSize: 6,
        startPos: { x: 1, y: 1, dir: 'S' },
        goalPos: { x: 4, y: 4 },
        obstacles: [{ x: 2, y: 2 }, { x: 3, y: 3 }],
        availableCommands: [CommandType.MOVE_FORWARD, CommandType.TURN_LEFT, CommandType.ACTION],
        optimalSteps: 8,
        tutorialText: "Imagina que la casilla final es una variable que necesita recibir un valor. ¡Llega a ella!",
        successMessage: "¡Conexión establecida!",
        learnConcept: "Las variables son espacios en memoria donde guardamos información para usarla después."
      },
      {
        id: 202,
        worldId: 2,
        title: 'Ruta Lógica',
        description: 'Navega un laberinto más complejo.',
        gridSize: 5,
        startPos: { x: 0, y: 4, dir: 'N' },
        goalPos: { x: 4, y: 0 },
        obstacles: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }],
        availableCommands: [CommandType.MOVE_FORWARD, CommandType.TURN_RIGHT, CommandType.TURN_LEFT],
        optimalSteps: 10,
        successMessage: "Tu lógica es impecable.",
        learnConcept: "A medida que el código crece, mantenerlo ordenado es esencial."
      },
      {
        id: 203,
        worldId: 2,
        title: 'El Laberinto Espiral',
        description: 'Entra al centro del espiral.',
        gridSize: 7,
        startPos: { x: 0, y: 0, dir: 'E' },
        goalPos: { x: 3, y: 3 },
        obstacles: [
           {x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1},
           {x:5,y:2},{x:5,y:3},{x:5,y:4},{x:5,y:5},
           {x:4,y:5},{x:3,y:5},{x:2,y:5},{x:1,y:5},
           {x:1,y:4},{x:1,y:3},{x:1,y:2}
        ],
        availableCommands: [CommandType.MOVE_FORWARD, CommandType.TURN_RIGHT],
        optimalSteps: 15,
        tutorialText: "Sigue el camino abierto. Tendrás que girar muchas veces a la derecha.",
        successMessage: "¡Has desenredado el problema!",
        learnConcept: "Los algoritmos de búsqueda de caminos (Pathfinding) son fundamentales en IA de videojuegos."
      }
    ]
  },
  {
    id: 3,
    name: 'Laguna de Bucles',
    description: 'Repite acciones sin escribir código extra. ¡Optimiza!',
    color: 'from-green-500 to-emerald-400',
    icon: 'Repeat',
    isLocked: false,
    levels: [
      {
        id: 301,
        worldId: 3,
        title: 'La Pista Larga',
        description: 'Usa el bloque de bucle para avanzar más rápido.',
        gridSize: 6,
        startPos: { x: 0, y: 2, dir: 'E' },
        goalPos: { x: 5, y: 2 },
        obstacles: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 3}, {x: 0, y: 4}], // Decoración
        availableCommands: [CommandType.MOVE_FORWARD, CommandType.MOVE_THREE],
        optimalSteps: 2,
        tutorialText: "¿Ves lo lejos que está la meta? En lugar de poner 3 bloques de 'Avanzar', usa el bloque 'Avanzar x3'. ¡Eso es un bucle!",
        successMessage: "¡Eso fue rápido! Ahorraste tiempo y espacio.",
        learnConcept: "Un BUCLE (Loop) repite una acción varias veces. 'Avanzar x3' es igual a escribir 'Avanzar' tres veces, pero más eficiente."
      },
      {
        id: 302,
        worldId: 3,
        title: 'Cuadrado Perfecto',
        description: 'Repite patrones para formar un camino.',
        gridSize: 6,
        startPos: { x: 1, y: 1, dir: 'E' },
        goalPos: { x: 1, y: 2 }, 
        obstacles: [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }], 
        availableCommands: [CommandType.MOVE_THREE, CommandType.TURN_RIGHT, CommandType.MOVE_FORWARD],
        optimalSteps: 8,
        tutorialText: "Tienes que rodear el bloque central. Busca el patrón: Avanzar largo, Girar, Avanzar largo, Girar...",
        successMessage: "Identificaste el patrón correctamente.",
        learnConcept: "En programación, si ves que repites el mismo código muchas veces, ¡probablemente necesitas un bucle!"
      },
      {
        id: 303,
        worldId: 3,
        title: 'Escalera al Cielo',
        description: 'Sube la escalera usando patrones repetitivos.',
        gridSize: 7,
        startPos: { x: 0, y: 6, dir: 'E' },
        goalPos: { x: 6, y: 0 },
        obstacles: [
            {x:0,y:5}, {x:1,y:5}, 
            {x:1,y:4}, {x:2,y:4},
            {x:2,y:3}, {x:3,y:3},
            {x:3,y:2}, {x:4,y:2},
            {x:4,y:1}, {x:5,y:1},
        ],
        availableCommands: [CommandType.MOVE_FORWARD, CommandType.TURN_LEFT, CommandType.TURN_RIGHT],
        optimalSteps: 12,
        tutorialText: "Derecha, Izquierda, Derecha, Izquierda... El patrón se repite como una escalera.",
        successMessage: "¡Subiste la escalera algorítmica!",
        learnConcept: "Los algoritmos iterativos resuelven problemas grandes repitiendo pasos pequeños muchas veces."
      },
       {
        id: 304,
        worldId: 3,
        title: 'Eficiencia Máxima',
        description: 'Combina bucles y giros para ganar con pocos bloques.',
        gridSize: 8,
        startPos: { x: 0, y: 0, dir: 'S' },
        goalPos: { x: 6, y: 6 },
        obstacles: [
           {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, // Muro izq
           {x:3, y:0}, {x:3, y:1}, {x:3, y:2}, {x:3, y:3}, {x:3, y:4}, // Muro central
        ],
        availableCommands: [CommandType.MOVE_THREE, CommandType.MOVE_FORWARD, CommandType.TURN_LEFT, CommandType.TURN_RIGHT],
        optimalSteps: 6,
        tutorialText: "Usa 'Avanzar x3' siempre que puedas para reducir la cantidad de instrucciones.",
        successMessage: "¡Eres un optimizador nato!",
        learnConcept: "La optimización de código hace que los programas sean más rápidos y consuman menos batería."
      }
    ]
  },
  {
    id: 4,
    name: 'Caverna de Comandos',
    description: 'Retos complejos que requieren combinar todo lo aprendido.',
    color: 'from-orange-500 to-red-500',
    icon: 'Terminal',
    isLocked: false,
    levels: [
        {
            id: 401,
            worldId: 4,
            title: 'El Cruzamiento',
            description: 'Navega a través de un campo de obstáculos denso.',
            gridSize: 7,
            startPos: {x: 0, y: 3, dir: 'E'},
            goalPos: {x: 6, y: 3},
            obstacles: [
                {x: 1, y: 3}, {x: 3, y: 3}, {x: 5, y: 3}, // Bloqueos en linea recta
                {x: 1, y: 2}, {x: 1, y: 4},
                {x: 3, y: 2}, {x: 3, y: 4},
                {x: 5, y: 2}, {x: 5, y: 4}
            ],
            availableCommands: [CommandType.MOVE_FORWARD, CommandType.TURN_LEFT, CommandType.TURN_RIGHT, CommandType.MOVE_THREE],
            optimalSteps: 12,
            tutorialText: "La línea recta está bloqueada. Tendrás que zigzaguear. ¿Puedes usar el bucle de 3 pasos en algún lugar?",
            successMessage: "Has superado el sistema de seguridad.",
            learnConcept: "A veces la solución más corta no es una línea recta. Evalúa todas las rutas posibles."
        },
        {
            id: 402,
            worldId: 4,
            title: 'Vuelta al Mundo',
            description: 'Recorre todo el perímetro.',
            gridSize: 5,
            startPos: {x: 0, y: 0, dir: 'E'},
            goalPos: {x: 1, y: 0},
            obstacles: [
                {x:1,y:1}, {x:2,y:1}, {x:3,y:1},
                {x:1,y:2}, {x:2,y:2}, {x:3,y:2},
                {x:1,y:3}, {x:2,y:3}, {x:3,y:3}
            ],
            availableCommands: [CommandType.MOVE_THREE, CommandType.TURN_RIGHT, CommandType.MOVE_FORWARD],
            optimalSteps: 8,
            tutorialText: "Recorre los bordes exteriores. Usa 'Avanzar x3' para cubrir los lados largos rápidamente.",
            successMessage: "¡Perímetro asegurado!",
            learnConcept: "Reconocer la estructura del problema te permite aplicar soluciones prefabricadas (patrones)."
        }
    ]
  }
];
