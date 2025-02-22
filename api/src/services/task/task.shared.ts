// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Task, TaskData, TaskPatch, TaskQuery, TaskService } from './task.class'

export type { Task, TaskData, TaskPatch, TaskQuery }

export type TaskClientService = Pick<TaskService<Params<TaskQuery>>, (typeof taskMethods)[number]>

export const taskPath = 'task'

export const taskMethods: Array<keyof TaskService> = ['find', 'get', 'create', 'patch', 'remove']

export const taskClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(taskPath, connection.service(taskPath), {
    methods: taskMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [taskPath]: TaskClientService
  }
}
