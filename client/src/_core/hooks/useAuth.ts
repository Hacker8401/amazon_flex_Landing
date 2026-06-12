// Simplified auth hook - no authentication required for this landing page
// Users can submit the form without logging in

export function useAuth() {
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: () => {},
    logout: async () => {},
  };
}
