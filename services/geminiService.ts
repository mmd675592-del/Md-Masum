
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export interface BitAIResponse {
  text: string;
  sources?: { title: string; uri: string }[];
  image?: string;
}

export const generateBitResponse = async (
  prompt: string, 
  history: { role: 'user' | 'model', text: string }[],
  imageBlob?: { data: string; mimeType: string }
): Promise<BitAIResponse> => {
  const ai = getAIClient();
  
  // Using gemini-3-flash-preview for lightning fast responses and search
  const model = 'gemini-3-flash-preview';
  
  const contents: any[] = [];
  const parts: any[] = [];
  
  if (imageBlob) {
    parts.push({
      inlineData: {
        data: imageBlob.data,
        mimeType: imageBlob.mimeType
      }
    });
  }
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts }],
      config: {
        systemInstruction: 'You are Bit, a high-speed AI assistant powered by Google Gemini. Your goal is to provide accurate, concise, and professional answers. Always use Google Search for real-time information. You can also generate images if asked. Speak naturally in Bengali and English.',
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri);

    return { text, sources };
  } catch (error) {
    console.error("Bit AI Error:", error);
    throw error;
  }
};

export const generateImageWithBit = async (prompt: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    // Using gemini-2.5-flash-image for high-quality native image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ text: `Generate a high-quality, professional, artistic image based on this description: ${prompt}. Make it visually stunning and detailed.` }] 
      },
      config: { 
        imageConfig: { 
          aspectRatio: "1:1"
        } 
      }
    });

    if (!response.candidates?.[0]?.content?.parts) return null;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

// Added exported function to handle image editing using Gemini 2.5 Flash Image model
export const editImageWithGemini = async (
  base64Image: string,
  prompt: string,
  mimeType: string
): Promise<string | null> => {
  const ai = getAIClient();
  
  // Strip potential base64 prefix if present (e.g., data:image/png;base64,...)
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) return null;

    // Iterate through all parts to find the image part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Editing Error:", error);
    throw error;
  }
};
