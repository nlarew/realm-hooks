import Realm from "realm"

type LocalOnlyConfigurationFields = typeof localOnlyConfigurationFields[number]
const localOnlyConfigurationFields = [
  "migration",
  "path",
  "schemaVersion",
  "deleteRealmIfMigrationNeeded"
] as const

export type LocalRealmConfiguration = Omit<Realm.Configuration, "sync">
export type SyncedRealmConfiguration = Required<Pick<Realm.Configuration, "sync">> &
  Omit<Realm.Configuration, LocalOnlyConfigurationFields>

const includesSyncConfiguration = (config: Realm.Configuration) => Boolean("sync" in config)

export const isLocalRealmConfiguration = (
  config: Realm.Configuration
): config is LocalRealmConfiguration => {
  return !includesSyncConfiguration(config)
}

export const isSyncedRealmConfiguration = (
  config: Realm.Configuration
): config is SyncedRealmConfiguration => {
  if (includesSyncConfiguration(config)) {
    const includedLocalOnlyConfigurationFields = localOnlyConfigurationFields.filter(
      (fieldName) => !config[fieldName]
    )
    includedLocalOnlyConfigurationFields.forEach((fieldName) => {
      console.warn(`Synced Realm configuration includes a local-only field: ${fieldName}`)
    })
    return true
  } else {
    return false
  }
}
