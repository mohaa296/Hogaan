
import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

export const getStudentInsights = async (students: Student[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const studentDataSummary = students.map(s => 
    `- ${s.fullName}: Wadanka: ${s.country}, Nooca: ${s.registrationType}${s.amount ? `, Lacagta: ${s.amount} ${s.currency}` : ''}`
  ).join('\n');

  const prompt = `
    Waxaad tahay kaaliye caqli badan oo maamula nidaamka HOGAAN (Online Learning System). 
    Waa kuwan xogta qaar ka mid ah ardayda diwaangashan:
    ${studentDataSummary}
    
    Fadlan iisoo koob xogtan (Somali language):
    1. Wadarta tirada ardayda iyo dakhliga kala duwan (USD iyo ETB) ee soo xarooday.
    2. Intee ka mid ah ayaa ku diwaangashan 'Lacag ah' iyo intee ayaa 'Free ah'.
    3. Sidee bay ardaydu ugu kala qaysban yihiin wadamada iyo saamaynta ay ku leeyihiin dakhliga labada lacagood.
    4. Maxaa talo ah oo aad siin lahayd maamulka nidaamka si loo kordhiyo dakhliga (gaar ahaan dalka Ethiopia oo isticmaala ETB) loona caawiyo ardayda danyarta ah ee 'Free ah' iyadoo la tixraacayo xogta dhaqaalaha iyo wadamada?
    
    U qor si qurux badan oo leh qodobbo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Waan ka xunnahay, ma helin wax jawaab ah hadda.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Khalad ayaa dhacay intii lagu jiray falanqaynta xogta.";
  }
};
