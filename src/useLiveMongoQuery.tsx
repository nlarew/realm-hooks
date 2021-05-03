import React from "react";
import { Collection, Document, LiveQueryConfig } from "./mongo-types";
import { useCollection } from "./useCollection";
import { useWatch } from "./useWatch";

// interface WatchedCollectionConfig {
//   service: string;
//   db: string;
//   collection: string;
//   changeHandlers: ChangeHandlers;
// }

// function useWatchedCollection(config: WatchedCollectionConfig) {
//   const collection = useCollection({
//     service: config.service,
//     db: config.db,
//     collection: config.collection,
//   });
//   useWatch(collection, config.changeHandlers);
//   return collection;
// }

export function useLiveMongoQuery<DocType extends Document = Document>(
  collection: Collection<DocType>,
  config: LiveQueryConfig<DocType>,
) {
  const [documents, setDocuments] = React.useState<DocType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const changeHandlers = !loading ? config.changeHandlers ?? {} : {};
  useWatch(collection, changeHandlers);

  React.useEffect(() => {
    const load = async () => {
      setDocuments(
        await collection.find(config.filter, {
          projection: config.project,
          sort: config.sort,
          limit: config.limit,
        })
      );
      setLoading(false);
    };
    try {
      load();
    } catch (err) {
      console.warn(`Failed to load documents for live query.`);
      console.error(err);
    }
  }, [collection, config.filter, config.project, config.sort, config.limit]);

  return { documents, loading };
}

type Test = { _id: number, createdAt: Date, name: string }

const collection = useCollection<Test>({
  db: "test",
  collection: "someCollection"
})

const { documents: tests, loading: loadingTests } = useLiveMongoQuery(collection, {
  filter: {
    createdAt: { $lt: new Date() }
  },
  project: {
    createdAt: 1,
    name: 1
  },
  sort: {
    createdAt: 1,
    name: -1
  },
  limit: 50,
  changeHandlers: {
    onInsert: (changeEvent) => {},
    onUpdate: (changeEvent) => {},
    onReplace: (changeEvent) => {},
    onDelete: (changeEvent) => {},
  }
})
