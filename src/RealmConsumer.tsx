import * as React from "react"
import { useRealmContext } from "./RealmContext"
import { UseRealmResult } from "./useRealm"

interface RealmConsumerProps {
  children: (realmContext: UseRealmResult) => React.ReactElement;
  // updateOnChange?: boolean;
}

export function RealmConsumer({ children }: RealmConsumerProps) {
  const realmContext = useRealmContext()
  if(!realmContext) {
    throw new Error("A <RealmConsumer /> must have a context provided by a <RealmProvider />")
  }
  return children(realmContext);
}
