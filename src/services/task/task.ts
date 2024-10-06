// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  taskDataValidator,
  taskPatchValidator,
  taskQueryValidator,
  taskResolver,
  taskExternalResolver,
  taskDataResolver,
  taskPatchResolver,
  taskQueryResolver
} from './task.schema'

import type { Application } from '../../declarations'
import { TaskService, getOptions } from './task.class'
import { taskPath, taskMethods } from './task.shared'

export * from './task.class'
export * from './task.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const task = (app: Application) => {
  // Register our service on the Feathers application
  app.use(taskPath, new TaskService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: taskMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(taskPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(taskExternalResolver),
        schemaHooks.resolveResult(taskResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(taskQueryValidator), schemaHooks.resolveQuery(taskQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(taskDataValidator), schemaHooks.resolveData(taskDataResolver)],
      patch: [schemaHooks.validateData(taskPatchValidator), schemaHooks.resolveData(taskPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [taskPath]: TaskService
  }
}
