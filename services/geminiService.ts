
import { Student } from "../types";

export const getStudentInsights = async (students: Student[]): Promise<string> => {
  try {
    const response = await fetch("/api/gemini/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ students })
    });
    
    if (!response.ok) {
      const errData = await response.json();
      return errData.error || "Khalad ayaa dhacay intii lagu jiray falanqaynta xogta.";
    }

    const data = await response.json();
    return data.insights || "Waan ka xunnahay, ma helin wax jawaab ah hadda.";
  } catch (error) {
    console.error("Gemini API Client Error:", error);
    return "Khalad ayaa dhacay intii lagu jiray falanqaynta xogta. Hubi in server-ku uu sax yahay.";
  }
};
