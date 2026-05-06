import { useCallback, useState } from "react";

export const useHttp = () => {
  const [process, setProcess] = useState('waiting');

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setProcess('loading');

    try {
      const response = await fetch(url, { method, body, headers });

      if (!response.ok) {
        throw new Error("Failed to fetch, status: " + response.statusText);
      }

      return await response.json();
    } catch (e) {
      setProcess('error');
      throw e;
    }
  }, []);

  const clearError = useCallback(() => {
    setProcess('loading');
  }, []);

  return { process, setProcess, clearError, request };
}