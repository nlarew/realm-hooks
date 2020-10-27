import * as React from "react"
import * as Realm from "realm"
import type { ConnectionState, ConnectionNotificationCallback } from "realm"

interface UseConnectionConfig {
  realm: Realm
  onChange: ConnectionNotificationCallback
}

export default function useConnection({ realm, onChange }: UseConnectionConfig): ConnectionState {
  const [state, setState] = React.useState<ConnectionState>(
    realm.syncSession?.connectionState ?? Realm.ConnectionState.Disconnected
  )
  React.useEffect(() => {
    if (realm.syncSession) {
      const handleNotification: ConnectionNotificationCallback = (newState, oldState) => {
        setState(newState)
        if (onChange) {
          onChange(newState, oldState)
        }
      }
      realm.syncSession.addConnectionNotification(handleNotification)
      return () => realm.syncSession?.removeConnectionNotification(handleNotification)
    }
    return
  }, [realm.syncSession])

  return state
}
