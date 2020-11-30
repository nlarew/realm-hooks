import useConnection from "./useRealmConnection"

const projectRealm = {} as Realm
const explicit = useConnection({
  realm: projectRealm,
  onChange: (newState, oldState) => {
    console.log(newState, oldState)
  }
})
// const implicit = useConnection({
//   onChange: (newState, oldState) => {
//     console.log(newState, oldState)
//   }
// })

describe("useConnection", () => {
  describe("when used with a local realm", () => {
    test("it does nothing", () => {
      expect(true).toBe(false)
    })
  })
  describe("when used with a synced realm", () => {
    test("it returns the current connection state", () => {
      expect(true).toBe(false)
    })
    test("it calls the user-provided onProgress callback", () => {
      expect(true).toBe(false)
    })
  })
})
