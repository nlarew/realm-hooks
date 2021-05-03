import React from "react"
import { Collection, Document, ChangeHandlers } from "./mongo-types"

export function useWatch<D extends Document = Document>(
  collection: Collection<D>,
  changeHandlers: ChangeHandlers<D>
) {
  const filter = React.useMemo(() => ({}), [])
  // We copy the handlers into a ref so that we can always call the latest version of each handler
  // without causing a re-render when the callbacks change. This can prevent infinite render loops
  // that would otherwise happen if the caller doesn't memoize their change handler functions.
  const handlersRef = React.useRef({...changeHandlers})
  React.useEffect(() => {
    handlersRef.current = {
      onInsert: changeHandlers.onInsert,
      onUpdate: changeHandlers.onUpdate,
      onReplace: changeHandlers.onReplace,
      onDelete: changeHandlers.onDelete
    }
  }, [changeHandlers.onInsert, changeHandlers.onUpdate, changeHandlers.onReplace, changeHandlers.onDelete])
  // Set up a MongoDB change stream that calls the provided change handler callbacks.
  React.useEffect(() => {
    const watchTodos = async () => {
      for await (const change of collection.watch({ filter })) {
        switch (change.operationType) {
          case "insert": {
            handlersRef.current.onInsert?.(change)
            break
          }
          case "update": {
            handlersRef.current.onUpdate?.(change)
            break
          }
          case "replace": {
            handlersRef.current.onReplace?.(change)
            break
          }
          case "delete": {
            handlersRef.current.onDelete?.(change)
            break
          }
          default: {
            // change.operationType will always be one of the specified cases, so we should never hit this default
            throw new Error(`Invalid change operation type: ${change.operationType}`)
          }
        }
      }
    }
    watchTodos()
  }, [collection, filter])
}
