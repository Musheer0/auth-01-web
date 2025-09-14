"use client "
import { Auth01User } from "./types";

export class Auth {
  private base_url = "http://localhost:3001/auth";
  async signUp(
    name: string,
    password: string,
    token_id: string,
    otp: string
  ): Promise<
    { user: Auth01User; status: number } |
    { error: string; status: number }
  > {
    const req = await fetch(this.base_url + "/sign-up", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, password, token_id, otp }),
    });

    if (req.status === 500) {
      return { error: "Internal server error", status: 500 };
    }

    try {
      const res = await req.json();
      if (res?.user) {
        return { user: res.user, status: req.status };
      }
      return {
        error: res?.message || res?.error || "Something went wrong",
        status: req.status,
      };
    } catch {
      return { error: "Internal server error", status: 500 };
    }
  }





  async verifyEmail(
    email: string
  ): Promise<
    { verify_token: string; expiresAt: string } |
    { error: string }
  > {
    const req = await fetch(this.base_url + "/sign-up/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    try {
      return await req.json();
    } catch {
      return { error: "Internal server error" };
    }
  }



  async signIn(
    email: string,
    password: string,
  ): Promise<
    { user: Auth01User; status: number } |
    { error: string; status: number }
  > {
    const req = await fetch(this.base_url + "/sign-in", {
      method: "POST",
      credentials: "include", // important for cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (req.status === 500) {
      return { error: "Internal server error", status: 500 };
    }

    try {
      const res = await req.json();
      if (res?.user) {
        return { user: res.user, status: req.status };
      }
      return {
        error: res?.message || res?.error || "Invalid email or password",
        status: req.status,
      };
    } catch {
      return { error: "Internal server error", status: 500 };
    }
  }
  async verify2fa(
    token: string,
    otp: string
  ): Promise<
    { user: Auth01User; status: number } |
    { error: string; status: number }
  > {
    const req = await fetch(this.base_url + "/sign-in/2fa", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token,code: otp }),
    });
    if (req.status === 500) {
      return { error: "Internal server error", status: 500 };
    }
    try {
      const res = await req.json();
      if (res?.user) {
        return { user: res.user, status: req.status };
      }
      return {
        error: res?.message || res?.error || "Invalid OTP",
        status: req.status,
      };
    } catch {
      return { error: "Internal server error", status: 500 };
    }
  }
  async RedirectToGoogleSignIn(redirect_uri:string):Promise<{error:string,status:number}|string>{
    const url = encodeURI(redirect_uri)
    const response = await fetch(this.base_url+'/sign-in/google?redirect_url='+url);
    if(!response.ok){
        return {error:'error login with google',status:response.status}
    }
    const {url:oauth_url} = await response.json()
    return oauth_url
  }

  async HandleGoogleCallback(
  args: {
    code: string;
    scope?: string;
    authuser?: string;
    prompt?: string;
    state:string
  }
): Promise<{ user: Auth01User; status: number } | {error:string,status:number}> {
  const query = new URLSearchParams(args as Record<string, string>).toString();
  try {
    const req = await fetch(`${this.base_url}/callback/google?${query}`, {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (req.status >= 500) {
      return { error: "Internal server error", status: 500 };
    }

    const res = await req.json();
    if(res?. verification_id){
      window.location.replace('/twofa?token='+res?.verification_id)
    }
    if (res?.user) {
      return { user: res.user, status: req.status };
    }

    return {
      error: res?.message || res?.error || "Google callback failed",
      status: req.status,
    };
  } catch (err) {
    return { error: "Internal server error", status: 500 };
  }
}


async RequestPasswordReset(
  email: string
): Promise<{ tokenId: string; expiresAt: string; status: number } | { error: string; status: number }> {
  try {
    const req = await fetch(`${this.base_url}/reset-password/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (req.status >= 500) {
      return { error: "Internal server error", status: 500 };
    }

    const res = await req.json();

    if (res?.tokenId && res?.expiresAt) {
      return { tokenId: res.tokenId, expiresAt: res.expiresAt, status: req.status };
    }

    return { error: res?.message || "Failed to request password reset", status: req.status };
  } catch {
    return { error: "Internal server error", status: 500 };
  }
}

async ResetPassword(
  token_id: string,
  otp: string,
  password: string
): Promise<{ success: boolean; status: number } | { error: string; status: number }> {
  try {
    const req = await fetch(`${this.base_url}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_id, otp, password }),
    });

    if (req.status >= 500) {
      return { error: "Internal server error", status: 500 };
    }

    const res = await req.json();

    if (res?.success) {
      return { success: true, status: req.status };
    }

    return { error: res?.message || "Failed to reset password", status: req.status };
  } catch {
    return { error: "Internal server error", status: 500 };
  }
}

async ResendEmailVerification(
  email: string
): Promise<{ verify_token: string; expiresAt: string; status: number } | { error: string; status: number }> {
  try {
    const req = await fetch(`${this.base_url}/resend/email-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (req.status >= 500) {
      return { error: "Internal server error", status: 500 };
    }

    const res = await req.json();

    if (res?.verify_token && res?.expiresAt) {
      return { verify_token: res.verify_token, expiresAt: res.expiresAt, status: req.status };
    }

    return { error: res?.message || "Failed to resend verification email", status: req.status };
  } catch {
    return { error: "Internal server error", status: 500 };
  }
}
async Me(){
   try {
  const req = await fetch(`${this.base_url}/me  `, {
    credentials: "include",
    });

    if (req.status >= 500) {
      return { error: "Internal server error", status: 500 };
    }

    const res = await req.json();
    return {res}
    return { error: res?.message || "Failed to resend verification email", status: req.status };
  } catch {
    return { error: "Internal server error", status: 500 };
  }
}
async logout(): Promise<{ success: boolean; status: number } | { error: string; status: number }> {
  try {
    const req = await fetch(`${this.base_url}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (req.status >= 500) {
      return { error: "Internal server error", status: 500 };
    }

    const res = await req.json();

    if (res?.success) {
      window.location.replace("/");
      return { success: true, status: req.status };
    }

    return { error: res?.message || "Logout failed", status: req.status };
  } catch {
    return { error: "Internal server error", status: 500 };
  }
}
async Enable2fa (){
 try {
    const req = await fetch(`${this.base_url}/2fa`, {
      method: "PATCH",
      credentials: "include",
    });

    if (req.status >= 500) {
      return { error: "Internal server error", status: 500 };
    }

    const res = await req.json();

    if (res?.success) {
         return {success:!!res?.success}
 
    }

    return { error: res?.message || " failed", status: req.status };
  } catch {
    return { error: "Internal server error", status: 500 };
  }
}
async Disable2fa (){
   try {
    const req = await fetch(`${this.base_url}/2fa/disable`, {
      method: "PATCH",
      credentials: "include",
    });

    if (req.status >= 500) {
      return { error: "Internal server error", status: 500 };
    }

    const res = await req.json();

    if (res?.success) {
         return {success:!!res?.success}
 
    }
    return { error: res?.message || " failed", status: req.status };
  } catch {
    return { error: "Internal server error", status: 500 };
  }
}
}

export const auth01Client = new Auth()