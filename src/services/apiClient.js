const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

export async function fetcher(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
