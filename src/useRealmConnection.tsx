import * as React from 'react'
import * as Realm from 'realm'

// const projectRealm = {} as Realm
// // If passed just a callback, get the realm from context
// const connectionState1: ConnectionState = useConnection((newState, oldState) => {
//   console.log(newState, oldState)
// });
// // If passed a realm, use that instead of a realm from context
// const connectionState: ConnectionState = useConnection(projectRealm, (newState, oldState) => {
//   console.log(newState, oldState)
// });
// // Or use a polymorphic object?
// const connectionState3: ConnectionState = useConnection({
//   realm: projectRealm,
//   onChange: (newState, oldState) => {
//     console.log(newState, oldState)
//   }
// });
// const connectionState4: ConnectionState = useConnection({
//   realm: projectRealm,
//   onChange: (newState, oldState) => {
//     console.log(newState, oldState)
//   }
// });

enum ConnectionState {
  Invalid = "invalid",
  Disconnected = "disconnected",
  Connecting = "connecting",
  Connected = "connected",
}
type ConnectionNotificationCallback = (newState: ConnectionState, oldState: ConnectionState) => void;

export default function useConnection(realm: Realm, onChange?: ConnectionNotificationCallback): ConnectionState {
  const [state, setState] = React.useState<ConnectionState>((realm.syncSession?.state as ConnectionState) ?? ConnectionState.Disconnected);
  React.useEffect(() => {
    if(realm.syncSession) {
      const handleNotification: ConnectionNotificationCallback = (newState, oldState) => {
        setState(newState);
        if(onChange) {
          onChange(newState, oldState);
        }
      }
      realm.syncSession.addConnectionNotification(handleNotification);
      return () => realm.syncSession?.removeConnectionNotification(handleNotification);
    }
  }, [realm.syncSession])
  
  return state;
}
