
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem('auth_token');

  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(import.meta.env.PUBLIC_API_BASE_URL + path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Manejo de errores centralizado
    const data = await response.json();
    throw new Error(`Error: ${data?.message}`);
  }

  return response;
}
