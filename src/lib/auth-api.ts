import { apiRequest } from "./api";

export type UserRole = "student" | "admin";
export type OAuthProvider = "google" | "facebook";


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}


export interface AuthResult {
  token: string;
  user: User;
}


const STORAGE_KEY = "numlab.auth";


interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}


interface RawUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
}



// ==============================
// Récupérer utilisateur connecté
// ==============================

async function fetchCurrentUser(): Promise<User> {

  const raw = await apiRequest<RawUser>("/auth/me");

  return {
    id: raw.id,
    name: raw.full_name,
    email: raw.email,
    role: raw.role,
  };
}



// ==============================
// LOGIN
// ==============================

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {


  const tokens = await apiRequest<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );


  // Stocker le token avant /auth/me
  // car /auth/me nécessite Authorization Bearer

  localStorage.setItem(
    "numlab.token",
    tokens.access_token
  );


  localStorage.setItem(
    "numlab.refresh_token",
    tokens.refresh_token
  );



  // récupérer l'utilisateur connecté

  const user = await fetchCurrentUser();



  const result: AuthResult = {
    token: tokens.access_token,
    user,
  };



  // sauvegarder session complète

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(result)
  );


  return result;
}



// ==============================
// REGISTER
// ==============================

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {


  await apiRequest<User>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        full_name: data.name,
        email: data.email,
        password: data.password,
      }),
    }
  );


  return login(
    data.email,
    data.password
  );
}



// ==============================
// GOOGLE LOGIN
// ==============================

export async function oauthSignIn(
  provider: OAuthProvider
): Promise<AuthResult> {


  if(provider === "google"){

    window.location.href =
      "http://localhost:8000/auth/google";


    return new Promise(() => {});
  }


  throw new Error(
    `La connexion via ${provider} n'est pas disponible.`
  );
}



// ==============================
// GOOGLE CALLBACK
// ==============================

export async function handleGoogleCallback(
  accessToken:string,
  refreshToken:string
):Promise<AuthResult>{


  localStorage.setItem(
    "numlab.token",
    accessToken
  );


  localStorage.setItem(
    "numlab.refresh_token",
    refreshToken
  );



  const user = await fetchCurrentUser();



  const result:AuthResult = {
    token:accessToken,
    user
  };



  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(result)
  );


  return result;
}



// ==============================
// PASSWORD
// ==============================

export async function forgotPassword(
  email:string
):Promise<void>{


  await apiRequest<void>(
    "/auth/forgot-password",
    {
      method:"POST",
      body:JSON.stringify({
        email
      })
    }
  );
}



export async function resetPassword(
  token:string,
  password:string
):Promise<void>{


  await apiRequest<void>(
    "/auth/reset-password",
    {
      method:"POST",
      body:JSON.stringify({
        token,
        new_password:password
      })
    }
  );
}



export async function verifyEmail(
  token:string
):Promise<void>{


  await apiRequest<void>(
    "/auth/verify-email",
    {
      method:"POST",
      body:JSON.stringify({
        token
      })
    }
  );
}



// ==============================
// SESSION
// ==============================

export function getStoredAuth():AuthResult|null{


  if(typeof window === "undefined")
    return null;


  try{

    const raw =
      localStorage.getItem(STORAGE_KEY);


    return raw
      ? JSON.parse(raw)
      : null;


  }catch{

    return null;

  }

}



// ==============================
// LOGOUT
// ==============================

export function logout(){


  localStorage.removeItem(
    STORAGE_KEY
  );


  localStorage.removeItem(
    "numlab.token"
  );


  localStorage.removeItem(
    "numlab.refresh_token"
  );

}
