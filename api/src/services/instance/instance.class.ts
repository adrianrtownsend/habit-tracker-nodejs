// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Instance, InstanceData, InstancePatch, InstanceQuery } from './instance.schema'

export type { Instance, InstanceData, InstancePatch, InstanceQuery }

export interface InstanceParams extends MongoDBAdapterParams<InstanceQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class InstanceService<ServiceParams extends Params = InstanceParams> extends MongoDBService<
  Instance,
  InstanceData,
  InstanceParams,
  InstancePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('instance')),
    multi: true
  }
}
