import { GoogleGenAI } from "@google/genai";
import { LevelData, Command } from "../types";

const apiKey = process.env.API_KEY || ''; // Fallback for development if env not set, but required for real use

let ai: GoogleGenAI | null = null;

try {
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    }
} catch (error) {
    console.error("Failed to initialize Gemini Client", error);
}

export const getAiHint = async (
  level: LevelData, 
  currentCommands: Command[], 
  userAttemptCount: number
): Promise<string> => {
  if (!ai) return "Servicio de IA no disponible. Por favor revisa la configuración de la API.";

  const prompt = `
    Eres un tutor de programación amigable para un juego llamado CodeQuest.
    El usuario está atascado en el nivel "${level.title}".
    
    Objetivo del nivel: Mover el robot de (${level.startPos.x}, ${level.startPos.y}) a (${level.goalPos.x}, ${level.goalPos.y}).
    Tamaño de cuadrícula: ${level.gridSize}x${level.gridSize}.
    Obstáculos en: ${JSON.stringify(level.obstacles)}.
    
    El usuario ha armado esta secuencia de comandos actualmente:
    ${currentCommands.map(c => c.type).join(' -> ')}
    
    Este es su intento #${userAttemptCount}.
    
    Por favor da una pista corta y alentadora (máximo 2 oraciones). No des la respuesta directa.
    Enfócate en el error lógico si hay uno (ej: "Giraste a la izquierda, pero la meta está a la derecha").
    IMPORTANTE: Responde en Español.
    Tono: Alegre, como un robot compañero amigable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "¡Sigue intentando! Revisa tus pasos cuidadosamente.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tengo problemas conectando con el servidor central. ¡Intenta depurar tu lógica manualmente!";
  }
};

export const generateDailyChallengeDescription = async (): Promise<{title: string, task: string}> => {
    if (!ai) return { title: "Sistema Desconectado", task: "Practica tus algoritmos básicos en la zona de pruebas." };

    const prompt = `
        Genera una descripción corta y divertida para un "Reto Diario de Programación" para un programador principiante.
        Formato JSON: { "title": "string", "task": "string" }.
        La tarea debe ser conceptual, como "Arregla un bucle roto" o "Optimiza una ruta".
        IMPORTANTE: El contenido debe estar en ESPAÑOL.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if(text) return JSON.parse(text);
        return { title: "Arreglo de Bug Diario", task: "Revisa tu código anterior para optimizaciones." };
    } catch (e) {
        return { title: "Puzzle de Lógica Diario", task: "Resuelve el laberinto usando solo 5 bloques." };
    }
}