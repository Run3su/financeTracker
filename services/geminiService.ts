import { GoogleGenAI } from "@google/genai";
import { FinancialData } from '../types';

export const getFinancialInsights = async (data: FinancialData): Promise<string> => {
  try {
    // Initialize the AI client here, only when the function is called.
    // This prevents a crash on load if the API key environment variable isn't set.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Analyze the following financial data for a user in Zambia (Currency: Kwacha).
      
      Data:
      - Total Balance: ${data.totalBalance}
      - Income Sources: ${JSON.stringify(data.incomeSources)}
      - Spending Categories: ${JSON.stringify(data.spendingCategories)}
      - Recent Transactions: ${JSON.stringify(data.recentTransactions)}

      Provide 3 short, punchy, and professional insights or tips to improve their financial health. 
      Focus on the balance between business income and spending. 
      Keep the tone calm, encouraging, and professional.
      Format as a simple HTML list using <li> tags, no <ul> wrapper.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class personal finance advisor. Your advice is minimal, elegant, and highly practical.",
      }
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('process is not defined')) {
        return "AI insights are unavailable. The API key is not configured for this deployment."
    }
    return "AI insights are currently unavailable. Please check your connection or API key setup.";
  }
};