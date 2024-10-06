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
    createdAt: Type.Number(),
    userId: Type.String({ objectid: true }),
    user: Type.Ref(userSchema)
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
export const taskDataSchema = Type.Pick(taskSchema, ['text'], {
  $id: 'TaskData'
})
export type TaskData = Static<typeof taskDataSchema>
export const taskDataValidator = getValidator(taskDataSchema, dataValidator)
export const taskDataResolver = resolve<Task, HookContext<TaskService>>({})

// Schema for updating existing entries
export const taskPatchSchema = Type.Partial(taskSchema, {
  $id: 'TaskPatch'
})
export type TaskPatch = Static<typeof taskPatchSchema>
export const taskPatchValidator = getValidator(taskPatchSchema, dataValidator)
export const taskPatchResolver = resolve<Task, HookContext<TaskService>>({})

// Schema for allowed query properties
export const taskQueryProperties = Type.Pick(taskSchema, ['_id', 'text'])
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
export const taskQueryResolver = resolve<TaskQuery, HookContext<TaskService>>({})
