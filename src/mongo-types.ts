import * as Realm from "realm"

export type Document = Realm.Services.MongoDB.Document
export type Collection<D extends Document = Document> = Realm.Services.MongoDB.MongoDBCollection<D>

// export type _ChangeEvent<D extends Document = Document> = Realm.Services.MongoDB.ChangeEvent<D>
export type ChangeEvent<D extends Document = Document> =
  | InsertEvent<D>
  | UpdateEvent<D>
  | ReplaceEvent<D>
  | DeleteEvent<D>
export type InsertEvent<D extends Document = Document> = Realm.Services.MongoDB.InsertEvent<D>
export type UpdateEvent<D extends Document = Document> = Realm.Services.MongoDB.UpdateEvent<D>
export type ReplaceEvent<D extends Document = Document> = Realm.Services.MongoDB.ReplaceEvent<D>
export type DeleteEvent<D extends Document = Document> = Realm.Services.MongoDB.DeleteEvent<D>

export type ChangeHandler<D extends Document, Event extends ChangeEvent<D>> = (changeEvent: Event) => void
export interface ChangeHandlers<D extends Document = Document> {
  onInsert?: ChangeHandler<D, InsertEvent<D>>
  onUpdate?: ChangeHandler<D, UpdateEvent<D>>
  onReplace?: ChangeHandler<D, ReplaceEvent<D>>
  onDelete?: ChangeHandler<D, DeleteEvent<D>>
}

export type QueryFilter = Realm.Services.MongoDB.Filter

interface BaseProjection {
  _id?: 1 | 0
}
type Projected<D extends Document, Value extends 1 | 0> = BaseProjection & { [field in keyof Omit<Partial<D>, "_id">]: Value }
type OmitProjection<D extends Document = Document> = Projected<D, 0>
type IncludeProjection<D extends Document = Document> = Projected<D, 1>
export type Projection<D extends Document = Document> = OmitProjection<D> | IncludeProjection<D>
export type Sort<D extends Document = Document> = {
  [field in keyof Partial<D>]: -1 | 1
}
export interface LiveQueryConfig<D extends Document = Document> {
  filter: QueryFilter
  project?: Projection<D>
  sort?: Sort<D>
  limit?: number
  changeHandlers?: ChangeHandlers<D>
}
