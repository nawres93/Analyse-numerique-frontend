const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  // 1. Récupération sécurisée du token
  let token = localStorage.getItem("numlab.token");
  const auth = localStorage.getItem("numlab.auth");

  if (!token && auth) {
    try {
      const parsed = JSON.parse(auth);
      token = parsed.token; // Extrait le vrai token sans les guillemets du JSON stringifié
    } catch (e) {
      console.error("Erreur de parsing de numlab.auth", e);
    }
  }

  // Nettoyage de sécurité : supprime les éventuels guillemets résiduels autour du token
  if (token) {
    token = token.replace(/^"|"$/g, '');
  }

  console.log("TOKEN ENVOYÉ :", token);

  // 2. Envoi de la requête
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      }
    }
  );

  // 3. Gestion des erreurs du serveur
  if (!response.ok) {
    // Si le token est invalide ou expiré (401), on nettoie et on redirige
    if (response.status === 401) {
      localStorage.removeItem("numlab.token");
      localStorage.removeItem("numlab.auth");
      
      // Redirection immédiate vers la page de login
      window.location.href = "/login"; 
      return Promise.reject("Session expirée, redirection...");
    }

    const errorText = await response.text();
    throw new Error(errorText || `Erreur ${response.status}`);
  }

  return response.json();
}
