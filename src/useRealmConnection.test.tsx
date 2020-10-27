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

describe("useRealmConnection", () => {
  test("it works", () => {
    expect(true).toBe(false)
  })
})
