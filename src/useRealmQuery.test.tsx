import * as Realm from "realm"
import useRealmQuery from "./useRealmQuery"

const projectRealm = {} as Realm
useRealmQuery({
  realm: projectRealm,
  type: "Task",
  filter: "status = 'Open'",
  sort: "name ASC",
  onChange: (openTasks, changes) => {
    // Update UI in response to deleted objects
    changes.deletions.forEach((index) => {
      // Deleted objects cannot be accessed directly,
      // but we can update a UI list, etc. knowing the index.
    });
    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => {
      let insertedTask = openTasks[index];
      // ...
    });
    // Update UI in response to modified objects
    changes.newModifications.forEach((index) => {
      let modifiedTask = openTasks[index];
      // ...
    });
  }
})

describe("useRealmQuery", () => {
  test("it works", () => {
    expect(true).toBe(false)
  })
})
