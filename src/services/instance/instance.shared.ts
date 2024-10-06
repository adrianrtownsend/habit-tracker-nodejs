// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Instance, InstanceData, InstancePatch, InstanceQuery, InstanceService } from './instance.class'

export type { Instance, InstanceData, InstancePatch, InstanceQuery }

export type InstanceClientService = Pick<
  InstanceService<Params<InstanceQuery>>,
  (typeof instanceMethods)[number]
>

export const instancePath = 'instance'

export const instanceMethods: Array<keyof InstanceService> = ['find', 'get', 'create', 'patch', 'remove']

export const instanceClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(instancePath, connection.service(instancePath), {
    methods: instanceMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [instancePath]: InstanceClientService
  }
}
