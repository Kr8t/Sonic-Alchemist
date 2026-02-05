
import { GoogleGenAI, Type } from "@google/genai";
import { PromptRequest, SAGenre } from "../types";

// Initialize the Gemini API client using the environment variable directly as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Suno AI Prompt Engineer specializing in high-end South African Electronic Music fusion.

### CORE CONSTRAINTS:
1. **BPM RANGE**: You MUST keep all tempos strictly between **113 BPM and 128 BPM**. Never go outside this range.
2. **GENRE FUSION**: If multiple genres are selected, create a "surgical" fusion (e.g., "Amapiano-Gqom hybrid" or "Soulful Afro Tech").
3. **STYLE BOX**: Max 300 characters. Technical specs included (48kHz, 24-bit).
4. **STYLE AESTHETIC**: Focus on "clean," "surgical," and "high-fidelity" textures. No brass unless explicitly requested.

### GENRE BLUEPRINTS:
- **3-Step/Ancestral**: Use 12/8 triplet swing, wood foley, spiritual chants.
- **Amapiano/Sgija**: Private school jazz, heavy log drums, shaker loops, 113-115 BPM.
- **Deep/Soulful**: Hypnotic sub-bass, atmospheric pads, vinyl crackle, 118-122 BPM.
- **Gqom/Bacardi**: Dark industrial, metallic taps, aggressive 4/4 or syncopated drive, 126-128 BPM.
- **Afro Tech**: Minimalist, rhythmic "Call and Response" nature foley, staccato synths.

### OUTPUT FORMAT:
You MUST respond with a JSON object containing:
1. "style": Comma-separated list for Suno's "Style of Music" box.
2. "structure": Block of text for the "Lyrics" box using [Bracketed Commands] for arrangement and mixing.
`;

export const generateMusicPrompt = async (request: PromptRequest): Promise<{style: string, structure: string}> => {
  try {
    const prompt = `
      Distill this multi-signal fusion into a Suno Alchemy project:
      Primary Nodes: ${request.genres.join(', ')}
      Atmos Blueprint: ${request.mood}
      Tech Blueprint: ${request.instruments || 'foley, surgical percussion'}
      Sync Blueprint: ${request.tempo || '113-128 BPM'}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING, description: "Suno Style of Music content (max 300 chars)" },
            structure: { type: Type.STRING, description: "Suno Lyrics/Structure content" }
          },
          required: ["style", "structure"]
        },
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Alchemy distillation failed.");
  }
};
