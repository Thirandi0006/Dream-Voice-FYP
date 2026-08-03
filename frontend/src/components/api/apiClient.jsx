// src/api/apiClient.js
export const apiFetch = (endpoint, options = {}) => {
  const { headers, ...rest } = options;
  return fetch(`http://localhost:5000${endpoint}`, {
    headers: {
      ...(!options.body || !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...rest,
  });
};
