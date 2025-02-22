// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
import * as instancesUtils from '../utils/instances'

export const generateInstances = async (context: HookContext) => {
  console.log(`Running hook generate-instances on ${context.path}.${context.method}`)

  const task = context.result
  const instances = await context.app.service('instance').find({
    query: {
      userId: context.params.user._id.toString()
    }
  })
  Promise.all(
    [...task].map(async (t) => {
      const generatedInstances = instancesUtils
        .generateInstances({ task: t, task_instances: instances.data })
        .map((instance) => {
          console.log('instance: ', instance, 'task: ', t)
          return {
            ...instance,
            taskId: t._id.toString()
          }
        })
      console.log('generated instances: ', generatedInstances)

      await context.app.service('instance').create(generatedInstances)
    })
  )
}
