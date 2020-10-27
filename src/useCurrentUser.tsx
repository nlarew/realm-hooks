import React from "react";
import * as Realm from "realm";
import useRealmApp from "./useRealmApp";

export default function useCurrentUser(): Realm.User | null {
  // const app = useRealmApp();
  // return app.currentUser;
  return null
}
type RequireLoggedInUserProps = {
  app?: Realm.App;
  fallback: React.ReactElement;
  children: React.ReactElement;
}
export function RequireLoggedInUser({ app, children, fallback }: RequireLoggedInUserProps): React.ReactElement {
  const contextApp = useRealmApp(app?.id);
  const { currentUser } = app ?? contextApp;
  if(currentUser) {
    return children
  } else {
    return fallback
  }
}
