import * as React from "react"
import * as Realm from "realm"
import { Collection, Document } from "./mongo-types";
import useRealmApp from "./useRealmApp"

interface UseCollection {
  service?: string
  db: string
  collection: string
}

// type Document = Realm.Services.MongoDB.Document
// type Collection<T extends Document> = Realm.Services.MongoDB.MongoDBCollection<T>

export function useCollection<D extends Document>({ service="mongodb-atlas", db, collection }: UseCollection): Collection<D> {
  const realmApp = useRealmApp();
  const _collection = React.useMemo(() => {
    if(!realmApp.currentUser) {
      throw new Error(`Must be logged in to call useCollection()`)
    }
    const mdb = realmApp.currentUser.mongoClient(service);
    return mdb.db(db).collection(collection);
  }, [realmApp.currentUser, service, db, collection]);
  return _collection
}
