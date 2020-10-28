import * as React from "react"
import * as Realm from "realm"
import type { ConnectionState, ConnectionNotificationCallback } from "realm"
import { useRealmWithContextFallback } from "./useRealm"

interface UseConnectionConfig {
  realm?: Realm
  onChange?: ConnectionNotificationCallback
}

export default function useConnection({ realm, onChange }: UseConnectionConfig): ConnectionState {
  const connectionRealm = useRealmWithContextFallback(realm)
  const [state, setState] = React.useState<ConnectionState>(
    connectionRealm.syncSession?.connectionState ?? ("disconnected" as Realm.ConnectionState)
  )
  React.useEffect(() => {
    if (connectionRealm.syncSession) {
      const handleNotification: ConnectionNotificationCallback = (newState, oldState) => {
        setState(newState)
        if (onChange) {
          onChange(newState, oldState)
        }
      }
      connectionRealm.syncSession.addConnectionNotification(handleNotification)
      return () => connectionRealm.syncSession?.removeConnectionNotification(handleNotification)
    }
    return
  }, [connectionRealm, connectionRealm.syncSession, onChange])

  return state
}
