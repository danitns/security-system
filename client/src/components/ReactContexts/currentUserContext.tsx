import { Session } from "@supabase/supabase-js";
import { createContext } from "react";

export interface ICurrentUser {
  session: Session | null;
}

export interface ICurrentUserContext {
  currentUser: ICurrentUser;
  setCurrentUser: (newValue: ICurrentUser) => void;
}

export const CurrentUserContext = createContext({} as ICurrentUserContext);
