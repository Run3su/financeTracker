import { ExchangeRates } from '../types';

// Switched to a more reliable, key-less, free API to resolve fetching errors.
const API_URL = 'https://open.er-api.com/v6/latest/USD';

/**
 * Fetches the latest currency exchange rates from the API.
 * The base currency is fixed to USD for simplicity.
 * @returns The latest exchange rates or null if an error occurs.
 */
export const getLatestRates = async (): Promise<ExchangeRates | null> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates (status: ${response.status})`);
    }
    const data = await response.json();
    
    // Check for success based on the new API's response format.
    if (data.result !== 'success') {
      throw new Error('API returned an error while fetching rates.');
    }

    // The API returns the rates object directly, which includes the USD base.
    return data.rates;
  } catch (error) {
    console.error("Error fetching latest exchange rates:", error);
    return null;
  }
};