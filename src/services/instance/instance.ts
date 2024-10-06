// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  instanceDataValidator,
  instancePatchValidator,
  instanceQueryValidator,
  instanceResolver,
  instanceExternalResolver,
  instanceDataResolver,
  instancePatchResolver,
  instanceQueryResolver
} from './instance.schema'

import type { Application } from '../../declarations'
import { InstanceService, getOptions } from './instance.class'
import { instancePath, instanceMethods } from './instance.shared'

export * from './instance.class'
export * from './instance.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const instance = (app: Application) => {
  // Register our service on the Feathers application
  app.use(instancePath, new InstanceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: instanceMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(instancePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(instanceExternalResolver),
        schemaHooks.resolveResult(instanceResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(instanceQueryValidator),
        schemaHooks.resolveQuery(instanceQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(instanceDataValidator),
        schemaHooks.resolveData(instanceDataResolver)
      ],
      patch: [
        schemaHooks.validateData(instancePatchValidator),
        schemaHooks.resolveData(instancePatchResolver)
      ],
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
    [instancePath]: InstanceService
  }
}
