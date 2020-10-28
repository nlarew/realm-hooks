import useRealmInitializer from "./useRealmInitializer"
import * as Realm from "realm"
import { ObjectId } from "bson"

const projectRealm = {} as Realm
useRealmInitializer({
  realm: projectRealm,
  initializer: (realm) => {
    realm.create("Task", {
      _id: new ObjectId(),
      name: "Do the dishes",
      status: "Open",
    })
    realm.create("Task", {
      _id: new ObjectId(),
      name: "Stack paper to the ceiling",
      status: "InProgress",
    })
    realm.create("Task", {
      _id: new ObjectId(),
      name: "Ride on 24 inch chrome",
      status: "Closed",
    })
    realm.create("Task", {
      _id: new ObjectId(),
      name: "Buy a new TV",
      status: "Closed",
    })
  }
})

describe("useRealmInitializer", () => {
  describe("when the realm is empty", () => {
    test("it successfully runs the provided initializer callback", () => {
      expect(true).toBe(false)
    })
  })
  describe("when the realm is not empty", () => {
    test("it does nothing", () => {
      expect(true).toBe(false)
    })
  })
})
