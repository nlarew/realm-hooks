import * as React from "react"
import * as Realm from "realm"

type AppConfig = Realm.AppConfiguration

export const RealmAppContext = React.createContext<AppConfig>({ id: "" })

interface RealmAppProps {
  id: string
  baseUrl?: string
}

export const RealmApp: React.FC<RealmAppProps> = ({ id, baseUrl, children }) => {
  const [config, setConfig] = React.useState<AppConfig>({ id, baseUrl })
  React.useEffect(() => {
    setConfig({ id, baseUrl })
  }, [id, baseUrl])
  return <RealmAppContext.Provider value={config}>{children}</RealmAppContext.Provider>
}

export const useRealmApp = (appId?: string): Realm.App => {
  const contextConfig = React.useContext(RealmAppContext)
  appId = appId ?? contextConfig?.id
  if (!appId) {
    throw new Error("Realm isn't configured anywhere")
  }
  // const app: Realm.App = Realm.App.getApp(appId);
  const app: Realm.App = new Realm.App(appId)
  // return app;
  const [currentUser, setCurrentUser] = React.useState<Realm.User | null>(app.currentUser)
  return new Proxy(app, {
    get: function (target: Realm.App, prop) {
      if (prop === "currentUser") {
        if (target.currentUser?.id !== currentUser?.id) {
          setCurrentUser(target.currentUser)
        }
      }
      return target[prop]
    },
    set: function (target: Realm.App, prop, value) {
      if (prop === "currentUser") {
        setCurrentUser(value)
      }
      target[prop] = value
      return true
    }
  })
}

export default useRealmApp
