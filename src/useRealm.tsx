import * as React from "react"
import Realm from "realm"
import { useRealmContext } from "./RealmContext"
import { isLocalRealmConfiguration, isSyncedRealmConfiguration } from "./RealmConfiguration"

export interface UseRealmResult {
  realm?: Realm
  loading: boolean
  error?: Error
}

export default function useRealm(config?: Realm.Configuration): UseRealmResult {
  // If the user provides no args and we're inside of a RealmProvider, we can use the provided realm from context.
  // If the user provides a config, we'll always use that to open a new realm instead.
  const overrideContext = Boolean(config)
  const realmContext = useRealmContext()
  if(!overrideContext && !realmContext) {

  }
  const [realm, setRealm] = React.useState<Realm | undefined>(
    overrideContext ? undefined : realmContext?.realm
  )
  const [loading, setLoading] = React.useState<boolean>(overrideContext || (realmContext?.loading ?? true))
  const [error, setError] = React.useState<Error | undefined>()

  React.useEffect(() => {
    if (!config && !realmContext) {
      throw new Error(
        "You must either pass a realm configuration directly or provide one with a <RealmProvider />"
      )
    }
    // Define a cleanup function. Used if we successfully open the realm.
    let cleanup: (() => void) | undefined = undefined
    // Open up the realm and manage the loading/error state
    async function open() {
      if (config) {
        try {
          const r = await Realm.open(config)
          setRealm(r)
          setLoading(false)
          cleanup = () => {
            r.close();
            setRealm(undefined);
          }
        } catch (err) {
          setError(err)
        }
      }
    }
    open()
    return cleanup
  }, [config, realmContext])

  return { realm, loading, error }
}

export function useSyncedRealm(config: Realm.Configuration): UseRealmResult {
  if (!isSyncedRealmConfiguration(config)) {
    throw new Error("Invalid synced realm configuration")
  }
  return useRealm(config)
}

export function useLocalRealm(config: Realm.Configuration): UseRealmResult {
  if (!isLocalRealmConfiguration(config)) {
    throw new Error("Invalid local realm configuration")
  }
  return useRealm(config)
}
