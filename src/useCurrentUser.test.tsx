import React from "react"
import * as Realm from "realm-web"
import useCurrentUser, { RequireLoggedInUser } from "./useCurrentUser"
import { unmountComponentAtNode } from "react-dom"
import { render, fireEvent, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
import useRealmApp, { RealmApp } from "./useRealmApp"

let container: Element | null = null
beforeEach(() => {
  // set up a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})
afterEach(() => {
  // cleanup on exiting
  if (container) {
    unmountComponentAtNode(container)
    container.remove()
    container = null
  }
})

let expectedErrors = 0
let actualErrors = 0
function onError(e: ErrorEvent) {
  e.preventDefault()
  actualErrors++
}
beforeEach(() => {
  expectedErrors = 0
  actualErrors = 0
  global.window.addEventListener("error", onError)
})
afterEach(() => {
  global.window.removeEventListener("error", onError)
  expect(actualErrors).toBe(expectedErrors)
  expectedErrors = 0
})

const APP_ID = "realm-hooks-kaaxo"

const Test = ({ children }: { children?: React.ReactNode }) => {
  const app = useRealmApp(APP_ID)
  const handleLogin = async () => {
    const anonCreds = Realm.Credentials.anonymous();
    await app.logIn(anonCreds);
  }
  return (
    <RequireLoggedInUser
      app={app}
      fallback={<button onClick={handleLogin}>Log In</button>}
    >
      <React.Fragment>
        <div>logged in</div>
        <h1>If you see this, you are logged in</h1>
        { children }
      </React.Fragment>
    </RequireLoggedInUser>
  )
}

describe("useCurrentUser", () => {
  test("returns the currently logged in user from a provided Realm.App", async () => {
    const Consumer = () => {
      const currentUser = useCurrentUser();
      return <h2>currentUser.id: {currentUser?.id}</h2>
    }
    render(
      <RealmApp id={APP_ID}>
        <Test>
          <Consumer />
        </Test>
      </RealmApp>
    )
    // fireEvent.click(screen.getByRole("button"))
    fireEvent.click(screen.getByRole("button"))
    // fireEvent.click(screen.getByText("Log In"))
    // await waitForElementToBeRemoved(() => screen.getByRole("button"))
    await waitForElementToBeRemoved(() => screen.getByRole("button"))
    // await waitForElementToBeRemoved(() => screen.getByText("Log In"))
    // expect(screen.getByText(/currentUser\.id/).textContent).not.toBeNull();
    expect(screen.getByText(/currentUser\.id/).textContent).not.toBeNull();
  })
})

describe("RequireLoggedInUser", () => {
  beforeEach(async () => {
    await Realm.App.getApp(APP_ID).currentUser?.logOut();
  })

  test("it renders the fallback if no user is logged in", async () => {
    render(<Test />)
    expect(screen.getByRole("button").textContent).toBe("Log In")
  })
  
  test("it renders its children if a user is logged in", async () => {
    render(<Test />)
    fireEvent.click(screen.getByRole("button"))
    await waitFor(() => screen.getByText("logged in"))
    expect(screen.getByRole("heading").textContent).toBe(
      "If you see this, you are logged in"
    )
  })
})
