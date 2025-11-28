import { GoogleGenAI } from "@google/genai";
import { FinancialData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (data: FinancialData): Promise<string> => {
  try {
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
    return "AI insights are currently unavailable. Please check your connection.";
  }
};
