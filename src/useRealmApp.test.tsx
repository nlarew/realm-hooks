import * as React from 'react'
import useRealmApp, { RealmApp } from './useRealmApp'
import { unmountComponentAtNode } from 'react-dom'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { ErrorBoundary } from 'react-error-boundary'

let container: Element | null = null
beforeEach(() => {
  // set up a DOM element as a render target
  container = document.createElement('div')
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

let expectedErrors = 0;
let actualErrors = 0;
function onError(e: ErrorEvent) {
  e.preventDefault();
  actualErrors++;
}
beforeEach(() => {
  expectedErrors = 0;
  actualErrors = 0;
  global.window.addEventListener('error', onError);
});
afterEach(() => {
  global.window.removeEventListener('error', onError);
  expect(actualErrors).toBe(expectedErrors);
  expectedErrors = 0;
});

describe('useRealmApp', () => {
  describe("if the component is wrapped by a <RealmApp /> context provider", () => {
    test("it returns the provided Realm.App if no arguments are provided", () => {
      const Test = ({ appId }: { appId: string }) => {
        const Consumer = () => {
          const app: Realm.App = useRealmApp()
          return <h1>{app.id}</h1>
        }
        return (
          <RealmApp id={appId}>
            <Consumer />
          </RealmApp>
        )
      }
      render(<Test appId='myapp-abcde' />)
      expect(screen.getByRole('heading').textContent).toBe('myapp-abcde')
    })
    test('it ignores the provided Realm.App if an App ID is passed as an argument', () => {
      const Test = ({
        providerAppId,
        argumentAppId
      }: {
        providerAppId: string
        argumentAppId: string
      }) => {
        const Consumer = () => {
          const app: Realm.App = useRealmApp(argumentAppId)
          return <h1>{app.id}</h1>
        }
        return (
          <RealmApp id={providerAppId}>
            <Consumer />
          </RealmApp>
        )
      }
      render(
        <Test providerAppId='myapp-abcde' argumentAppId='notmyapp-abcde' />
      )
      expect(screen.getByRole('heading').textContent).toBe('notmyapp-abcde')
    })
  })
  describe("if the component is not wrapped by a <RealmApp /> context provider", () => {
    test('it returns a Realm.App for a given App ID', () => {
      const Test = ({ appId }: { appId: string }) => {
        const app: Realm.App = useRealmApp(appId)
        return <h1>{app.id}</h1>
      }
      render(<Test appId='myapp-abcde' />)
      expect(screen.getByRole('heading').textContent).toBe('myapp-abcde')
    })
    test("it throws an error if no arguments are provided", () => {
      expectedErrors = 1;
      
      const ShouldFail = () => {
        const app: Realm.App = useRealmApp()
        return <h1>{app.id}</h1>
      }
      const onError = jest.fn()
      render(
        <ErrorBoundary
          onError={onError}
          FallbackComponent={({ error }) => (
            <div role='alert'>
              <p>error:</p>
              <pre>{error?.message}</pre>
            </div>
          )}
        >
          <ShouldFail />
        </ErrorBoundary>
      )
      expect(screen.getByRole("alert").textContent).toBe("error:Realm isn't configured anywhere")
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})
