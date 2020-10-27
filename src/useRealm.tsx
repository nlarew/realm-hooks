import * as React from "react";
import * as Realm from "realm";

// useSyncedRealm({
//   partitionValue: `user=${"abc209fd8sf"}`,
//   initializer: (realm: Realm): void => {
//     realm.create("CalendarEvent", { id: "foo", date: new Date("January 1, 2021 10:05:12.345Z") })
//   },
//   onConnectionChange: (newState: ConnectionState, oldState: ConnectionState) => {
//     console.log(newState, oldState)
//   },
//   onSyncProgress: (direction: Realm.ProgressDirection, transferred: number, transferable: number) => {
//     console.log(direction, transferred, transferable)
//   },
// })

export default function useRealm(config?: Realm.Configuration): Realm {
  if(!config) throw new Error("");
  const [realm, setRealm] = React.useState<Realm | null>();
  React.useEffect(() => {
    const openRealm = Realm.open(config);
    openRealm.then(setRealm);
    return () => openRealm.then((r: Realm) => r.close())
  }, [config.path])
  return realm
}

interface SyncedRealmConfig {
  partitionValue: string;
  schema: (Realm.ObjectClass | Realm.ObjectSchema)[];
}

export const useSyncedRealm = (config: SyncedRealmConfig): Realm => {
  const { currentUser } = useRealmApp();
  const { partitionValue, schema } = config;
  const [realm, setRealm] = React.useState<Realm | null>();
  React.useEffect(() => {
    if (currentUser) {
      Realm.open({
        path: partitionValue,
        schema: schema,
        sync: {
          user: currentUser,
          partitionValue: partitionValue,
        },
      }).then(setRealm);
    }
  }, [currentUser, partitionValue]);
  return realm;
};

type MigrationCallback = (oldRealm: Realm, newRealm: Realm) => void;
interface LocalRealmConfig {
  path: string;
  schema: (Realm.ObjectClass | Realm.ObjectSchema)[];
  schemaVersion?: number;
  migration?: MigrationCallback;
}

export const useLocalRealm = (config: LocalRealmConfig): Realm => {
  const { path, schema, schemaVersion, migration } = config;
  const [realm, setRealm] = React.useState<Realm | null>();
  React.useEffect(() => {
    Realm.open({
      path: path,
      schema: schema,
      schemaVersion: schemaVersion,
      migration: migration,
    }).then(setRealm);
  }, [path, schema, schemaVersion, migration]);
  return realm;
};
