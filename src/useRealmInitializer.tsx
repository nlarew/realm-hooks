import * as React from "react"
import * as Realm from "realm"

export type RealmInitializer = (realm: Realm) => void

export default function useRealmInitializer(realm: Realm, initializer: RealmInitializer): void {
  if (realm.empty) {
    realm.write(() => {
      initializer(realm)
    })
  }
}
