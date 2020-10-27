import React from 'react'

import { useRealmApp } from 'realm-hooks'

const App = () => {
  const app = useRealmApp("myapp-abcde")
  console.log("app", app)
  return <div>app id: {app.id}</div>
}

export default App
