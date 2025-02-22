// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TaskService } from './task.class'
import { userSchema } from '../users/users.schema'

// Main data model schema
export const taskSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    text: Type.String(),
    description: Type.String(),
    createdAt: Type.Number(),
    userId: Type.String({ objectid: true }),
    user: Type.Ref(userSchema),
    startDate: Type.String(),
    endDate: Type.String(),
    startHour: Type.Number(),
    startMinute: Type.Number(),
    endHour: Type.Number(),
    endMinute: Type.Number(),
    days: Type.Array(
      Type.Number({
        minimum: 0,
        maximum: 6
      })
    ),
    duration: Type.Number({
      minimum: 0,
      maximum: 120
    }),
    minWeeklyInstances: Type.Number(),
    maxWeeklyInstances: Type.Number()
  },
  { $id: 'Task', additionalProperties: false }
)
export type Task = Static<typeof taskSchema>
export const taskValidator = getValidator(taskSchema, dataValidator)
export const taskResolver = resolve<Task, HookContext<TaskService>>({
  user: virtual(async (task, context) => {
    // Associate the user that created the task
    return context.app.service('users').get(task.userId)
  })
})

export const taskExternalResolver = resolve<Task, HookContext<TaskService>>({})

// Schema for creating new entries
export const taskDataSchema = Type.Pick(
  taskSchema,
  [
    'text',
    'description',
    'startDate',
    'endDate',
    'startHour',
    'startMinute',
    'endHour',
    'endMinute',
    'days',
    'duration',
    'minWeeklyInstances',
    'maxWeeklyInstances'
  ],
  {
    $id: 'TaskData'
  }
)
export type TaskData = Static<typeof taskDataSchema>
export const taskDataValidator = getValidator(taskDataSchema, dataValidator)
export const taskDataResolver = resolve<Task, HookContext<TaskService>>({
  userId: async (_value, _task, context) => {
    // Associate the record with the id of the authenticated user
    return context.params.user?._id.toString()
  },
  createdAt: async () => {
    return Date.now()
  }
})

// Schema for updating existing entries
export const taskPatchSchema = Type.Partial(taskSchema, {
  $id: 'TaskPatch'
})
export type TaskPatch = Static<typeof taskPatchSchema>
export const taskPatchValidator = getValidator(taskPatchSchema, dataValidator)
export const taskPatchResolver = resolve<Task, HookContext<TaskService>>({})

// Schema for allowed query properties
export const taskQueryProperties = Type.Pick(taskSchema, ['_id', 'text', 'createdAt', 'userId'])
export const taskQuerySchema = Type.Intersect(
  [
    querySyntax(taskQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TaskQuery = Static<typeof taskQuerySchema>
export const taskQueryValidator = getValidator(taskQuerySchema, queryValidator)
export const taskQueryResolver = resolve<TaskQuery, HookContext<TaskService>>({
  userId: async (value, _, context) => {
    // We want to be able to find all messages but
    // only let a user modify their own messages otherwise
    if (context.params.user && context.method !== 'find') {
      return context.params.user._id
    }

    return value
  }
})
