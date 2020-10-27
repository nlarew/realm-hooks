import * as React from "react"
import * as Realm from "realm"
import useRealmApp from "./useRealmApp"

interface UseCollection {
  cluster?: string
  db: string
  collection: string
}

type Document = Realm.Services.MongoDB.Document
type Collection<T extends Document> = Realm.Services.MongoDB.MongoDBCollection<T>

export default function useCollection<T extends Document>({
  cluster = "mongodb-atlas",
  db,
  collection
}: UseCollection): Collection<T> {
  const { currentUser } = useRealmApp()
  if (!currentUser) throw new Error("Must be logged in")
  return React.useMemo(() => {
    return currentUser.mongoClient(cluster).db(db).collection(collection)
  }, [currentUser])
}
