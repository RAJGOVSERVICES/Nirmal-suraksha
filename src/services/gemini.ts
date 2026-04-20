import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getSafetyGuidance(userQuery: string, history: { role: 'user' | 'model', content: string }[]) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are 'Nirmal Sahayak', a highly empathetic and supportive AI safety assistant. 
    Your goal is to help victims of online blackmail, extortion, or non-consensual image sharing (NCII).

    CORE PRINCIPLES:
    1. EMPATHY FIRST: Use warm, non-judgmental language. Reassure the user that they are the victim and not at fault.
    2. PRACTICAL STEPS: Provide concrete advice:
       - Report to StopNCII.org (official tool).
       - Report to TakeItDown.org (for minors).
       - Lock social media profiles.
       - Do NOT pay the blackmailer (payment often leads to more demands).
       - Gather evidence (screenshots, URLs) before blocking.
       - Contact local police or cybercrime (cybercrime.gov.in in India).
    3. LANGUAGE: Respond in the language the user uses (English, Hindi, or Romanized Hindi/Hinglish).
    4. NO HACKING: If the user asks you to "block" or "hack" someone directly, explain that you cannot do that technically, but you can guide them to the official tools that social media platforms use to remove content.
    5. SAFETY: If the user expresses extreme distress (suicidal thoughts), provide international helpline information immediately.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: userQuery }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I'm here to support you. Please tell me more or ask about the next steps.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting right now, but please know you are not alone. Please consider reaching out to local authorities or using StopNCII.org immediately.";
  }
}
