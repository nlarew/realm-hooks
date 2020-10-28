import * as React from "react"
import * as Realm from "realm"
import { useRealmWithContextFallback } from "./useRealm"

type RealmQuery = {
  type: string
  filter?: string
  sort?: string
}

interface UseRealmQueryConfig<T extends Realm.Object> extends RealmQuery {
  realm?: Realm;
  onChange?: Realm.CollectionChangeCallback<T>;
}

const runQuery = <T extends Realm.Object>(realm: Realm, type: string, filter?: string, sort?: string): Realm.Results<T> => {
  const results = realm.objects<T>(type)
  if (filter) {
    results.filtered(filter)
  }
  if (sort) {
    results.sorted(sort)
  }
  return results
}

export default function useRealmQuery<T extends Realm.Object>({
  realm,
  type,
  filter,
  sort,
  onChange,
}: UseRealmQueryConfig<T>): Realm.Results<T> {
  const queryRealm = useRealmWithContextFallback(realm)
  
  // Run the specified query
  const [results, setResults] = React.useState<Realm.Results<T>>(runQuery(queryRealm, type, filter, sort))
  React.useEffect(() => {
    setResults(runQuery(queryRealm, type, filter, sort))
  }, [queryRealm, type, filter, sort])
  
  // Handle the onChange callback with a Realm.Collection listener
  React.useEffect(() => {
    if(onChange) {
      results.addListener(onChange);
      return () => results.removeListener(onChange);
    }
    return
  }, [onChange, results])

  return results
}
