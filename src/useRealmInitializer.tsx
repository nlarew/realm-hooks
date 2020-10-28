import * as React from "react"
import * as Realm from "realm"
import { useRealmWithContextFallback } from "./useRealm"

interface UseRealmInitializerConfig {
  realm?: Realm;
  initializer: (realm: Realm) => void
}

export default function useRealmInitializer({ realm, initializer }: UseRealmInitializerConfig): void {
  const initializeRealm = useRealmWithContextFallback(realm)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(!initializeRealm.empty)
  React.useEffect(() => {
    if(!isInitialized) {
      initializeRealm.write(() => {
        initializer(initializeRealm)
      })
      setIsInitialized(true)
    }
  }, [isInitialized])
}
