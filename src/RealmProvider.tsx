import * as React from "react"
import Realm from "realm"
import useRealm from "./useRealm"
import { RealmContext } from "./RealmContext"

interface RealmProviderProps {
  config: Realm.Configuration;
  children: React.ReactElement[];
}

export default function RealmProvider({ config, children }: RealmProviderProps) {
  const { realm, loading, error } = useRealm(config);

  return <RealmContext.Provider value={{ realm, loading, error }}>{children}</RealmContext.Provider>
}
