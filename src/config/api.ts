const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  console.warn(
    "VITE_API_URL is not set. Configure it with the public Railway backend URL."
  );
}

// Remove a trailing slash so every `${API_BASE_URL}/route` request has one
// separator, regardless of how the deployment variable is entered.
export const API_BASE_URL = (configuredApiUrl ?? "").replace(/\/+$/, "");
