import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { IUser } from "./src/app/context/AuthContext";

export interface AuthContextType {
  user: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
  loading: boolean;
  isRefetching : boolean;
  error : boolean,
  refetch : (options?: RefetchOptions) => Promise<QueryObserverResult<IUser, Error>>,
  isAuthenticated: boolean;
}