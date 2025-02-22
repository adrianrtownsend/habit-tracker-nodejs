// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const modifyInstances = async (context: HookContext) => {
  console.log(`Running hook modify-instances on ${context.path}.${context.method}`)
}
