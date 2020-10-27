import * as React from "react"
import Realm from "realm"
import { ObjectId } from "bson"
import useCurrentUser from "./useCurrentUser"
import { useDeepCompareMemo } from "use-deep-compare"

// Same as Realm.Configuration but with { sync: Partial<Realm.SyncConfiguration> }
interface UseRealmBaseConfig {
  encryptionKey?: ArrayBuffer | ArrayBufferView | Int8Array
  migration?: Realm.MigrationCallback
  shouldCompactOnLaunch?: (totalBytes: number, usedBytes: number) => boolean
  path?: string
  fifoFilesFallbackPath?: string
  readOnly?: boolean
  inMemory?: boolean
  schema?: (Realm.ObjectClass | Realm.ObjectSchema)[]
  schemaVersion?: number
  sync?: Partial<Realm.SyncConfiguration>
  deleteRealmIfMigrationNeeded?: boolean
  disableFormatUpgrade?: boolean
}

interface UseSyncedRealmConfig extends UseRealmBaseConfig {
  // Mark specific fields as required
  sync: {
    partitionValue: string | number | ObjectId | null
    user?: Realm.User
  }
  // Omit fields that only apply to non-sync realms
  schemaVersion: never
  migration: never
  deleteRealmIfMigrationNeeded: never
}

interface UseLocalRealmConfig extends UseRealmBaseConfig {
  // Mark specific fields as required
  path: string
  // Omit fields that only apply to synced realms
  sync: never
}

type UseRealmConfig = UseSyncedRealmConfig | UseLocalRealmConfig

const isSyncedRealmConfig = (config: UseRealmConfig): config is UseSyncedRealmConfig => {
  return Boolean(config.sync)
}

const isLocalRealmConfig = (config: UseRealmConfig): config is UseLocalRealmConfig => {
  return !isSyncedRealmConfig(config)
}

const useRealmConfiguration = (hookConfig: UseRealmConfig): Realm.Configuration => {
  const currentUser = useCurrentUser()
  const realmConfig: Realm.Configuration = useDeepCompareMemo(() => {
    if (isSyncedRealmConfig(hookConfig)) {
      if (!currentUser) {
        throw new Error("Must be logged in to call useRealm()")
      }
      return {
        ...hookConfig,
        sync: {
          ...hookConfig.sync,
          user: hookConfig.sync.user ?? currentUser
        }
      }
    } else {
      return hookConfig
    }
  }, [hookConfig, currentUser])
  return realmConfig
}

interface UseRealmResult {
  realm: Realm | null
  loading: boolean
  error: Error | null
}

export default function useRealm(config: UseRealmConfig): UseRealmResult {
  const [realm, setRealm] = React.useState<Realm | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | null>(null)

  const realmConfig: Realm.Configuration = useRealmConfiguration(config)

  React.useEffect(() => {
    let cleanup: (() => void) | undefined
    const open = async () => {
      setLoading(true)
      const r: Realm = await Realm.open(realmConfig)
      setLoading(false)
      setRealm(r)
      return () => r.close()
    }
    open()
      .then((closeRealm) => (cleanup = closeRealm))
      .catch((err) => setError(err))
    return () => {
      cleanup && cleanup()
    }
  }, [realmConfig])

  return { realm, loading, error }
}

export const useSyncedRealm = (config: UseSyncedRealmConfig): UseRealmResult => {
  return useRealm(config);
}

export const useLocalRealm = (config: UseLocalRealmConfig): UseRealmResult => {
  return useRealm(config);
}
