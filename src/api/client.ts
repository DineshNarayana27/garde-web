/**
 * Base API Client (Gateway)
 * Handles all API requests with proper error handling and logging
 */
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    console.log(`[Gateway] GET request to: ${endpoint}`);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`[Gateway] Request failed:`, error);
      throw error;
    }
  },
  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    console.log(`[Gateway] POST request to: ${endpoint}`);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`[Gateway] Request failed:`, error);
      throw error;
    }
  }
};
