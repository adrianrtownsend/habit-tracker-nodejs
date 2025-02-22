// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { InstanceService } from './instance.class'

// Main data model schema
export const instanceSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    taskId: Type.String({ objectid: true }),
    userId: Type.String({ objectid: true }),
    status: Type.Number(),
    startDateTime: Type.String(),
    endDateTime: Type.String(),
    createdAt: Type.Number()
  },
  { $id: 'Instance', additionalProperties: false }
)
export type Instance = Static<typeof instanceSchema>
export const instanceValidator = getValidator(instanceSchema, dataValidator)
export const instanceResolver = resolve<Instance, HookContext<InstanceService>>({})

export const instanceExternalResolver = resolve<Instance, HookContext<InstanceService>>({})

// Schema for creating new entries
export const instanceDataSchema = Type.Pick(
  instanceSchema,
  ['status', 'startDateTime', 'endDateTime', 'taskId'],
  {
    $id: 'InstanceData'
  }
)
export type InstanceData = Static<typeof instanceDataSchema>
export const instanceDataValidator = getValidator(instanceDataSchema, dataValidator)
export const instanceDataResolver = resolve<Instance, HookContext<InstanceService>>({
  createdAt: async () => {
    return Date.now()
  }
})

// Schema for updating existing entries
export const instancePatchSchema = Type.Partial(instanceSchema, {
  $id: 'InstancePatch'
})
export type InstancePatch = Static<typeof instancePatchSchema>
export const instancePatchValidator = getValidator(instancePatchSchema, dataValidator)
export const instancePatchResolver = resolve<Instance, HookContext<InstanceService>>({})

// Schema for allowed query properties
export const instanceQueryProperties = Type.Pick(instanceSchema, [
  '_id',
  'taskId',
  'userId',
  'status',
  'startDateTime',
  'endDateTime'
])
export const instanceQuerySchema = Type.Intersect(
  [
    querySyntax(instanceQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type InstanceQuery = Static<typeof instanceQuerySchema>
export const instanceQueryValidator = getValidator(instanceQuerySchema, queryValidator)
export const instanceQueryResolver = resolve<InstanceQuery, HookContext<InstanceService>>({})
