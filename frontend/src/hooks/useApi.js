// hooks/useApi.js
import { useState, useCallback } from "react";

/**
 * Custom hook for API calls with built-in loading and error handling
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export function useApi(apiFunction) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            try {
                setLoading(true);
                setError(null);
                setData(null);

                const result = await apiFunction(...args);
                setData(result);
                return result;
            } catch (err) {
                setError(err.message || "An unexpected error occurred");
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiFunction]
    );

    const reset = useCallback(() => {
        setData(null);
        setLoading(false);
        setError(null);
    }, []);

    return { data, loading, error, execute, reset };
}