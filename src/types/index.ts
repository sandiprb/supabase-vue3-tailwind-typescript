declare interface ICredentials {
  email?: string | undefined;
  password?: string | undefined;
  provider?: "bitbucket" | "github" | "gitlab" | "google" | undefined;
}


declare interface INote {
  id: string;
  title: string;
  content: string;
  user_id: string;
  last_updated: string;
  updated_at: string;
}