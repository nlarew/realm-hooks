import * as React from "react"
import * as Realm from "realm"
// import { ObjectId } from "bson"

// const projectRealm = {} as Realm
// useRealmInitializer(projectRealm, (realm) => {
//   realm.create("Task", {
//     _id: new ObjectId(),
//     name: "Do the dishes",
//     status: "Open",
//   })
//   realm.create("Task", {
//     _id: new ObjectId(),
//     name: "Stack paper to the ceiling",
//     status: "InProgress",
//   })
//   realm.create("Task", {
//     _id: new ObjectId(),
//     name: "Ride on 24 inch chrome",
//     status: "Closed",
//   })
//   realm.create("Task", {
//     _id: new ObjectId(),
//     name: "Buy a new TV",
//     status: "Closed",
//   })
// })

export type RealmInitializer = (realm: Realm) => void

export default function useRealmInitializer(realm: Realm, initializer: RealmInitializer): void {
  if (realm.empty) {
    realm.write(() => {
      initializer(realm)
    })
  }
}
