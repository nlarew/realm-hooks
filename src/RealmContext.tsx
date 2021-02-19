import * as React from "react"
import { UseRealmResult } from "./useRealm"

export const RealmContext = React.createContext<UseRealmResult | undefined>(undefined);

export function useRealmContext() {
  return React.useContext(RealmContext);
}
