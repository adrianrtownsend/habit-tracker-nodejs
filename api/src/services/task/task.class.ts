// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Task, TaskData, TaskPatch, TaskQuery } from './task.schema'

export type { Task, TaskData, TaskPatch, TaskQuery }

export interface TaskParams extends MongoDBAdapterParams<TaskQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class TaskService<ServiceParams extends Params = TaskParams> extends MongoDBService<
  Task,
  TaskData,
  TaskParams,
  TaskPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('task')),
    multi: true
  }
}
