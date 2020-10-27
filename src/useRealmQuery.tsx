import * as React from "react"
import * as Realm from "realm"
import useRealm from "./useRealm"

type RealmQuery = {
  type: string
  filter?: string
  sort?: string
}

export default function useRealmQuery<T extends Realm.Object>({
  type,
  filter,
  sort
}: RealmQuery): Realm.Results<T> {
  const realm = useRealm()
  const runQuery = (): Realm.Results<T> => {
    const results = realm.objects<T>(type)
    if (filter) {
      results.filtered(filter)
    }
    if (sort) {
      results.sorted(sort)
    }
    return results
  }

  const [results, setResults] = React.useState<Realm.Results<T>>(runQuery())

  React.useEffect(() => {
    setResults(runQuery())
  }, [type, filter, sort])

  return results
}
