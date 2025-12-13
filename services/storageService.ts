import { FinancialData } from '../types';

const APP_STATE_KEY = 'financeTrackerData';

interface AppState {
  userName: string;
  financialData: FinancialData;
}

/**
 * Saves the entire application state to localStorage.
 * @param userName The current user's name.
 * @param financialData The current financial data object.
 */
export const saveState = (userName: string, financialData: FinancialData): void => {
  try {
    const appState: AppState = { userName, financialData };
    const serializedState = JSON.stringify(appState);
    localStorage.setItem(APP_STATE_KEY, serializedState);
  } catch (error) {
    console.error("Could not save state to localStorage", error);
  }
};

/**
 * Loads the application state from localStorage.
 * @returns The saved state object or null if none exists.
 */
export const loadState = (): AppState | null => {
  try {
    const serializedState = localStorage.getItem(APP_STATE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState) as AppState;
  } catch (error) {
    console.error("Could not load state from localStorage", error);
    return null;
  }
};