export type Auth01User = {
  id: string; // Unique user ID (e.g., "usr_92jx81m4")
  created_at: string; // ISO date string when the user was created
  updated_at: string; // ISO date string when the user was last updated
  name: string; // User's full name
  primary_email: string; // Primary email address
  image_url: string; // URL to profile picture
  is_verified: boolean; // Whether email/account is verified
};
