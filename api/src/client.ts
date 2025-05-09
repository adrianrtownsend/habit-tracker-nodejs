// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { apiKeyClient } from './services/api-key/api-key.shared'
export type { ApiKey, ApiKeyData, ApiKeyQuery, ApiKeyPatch } from './services/api-key/api-key.shared'

import { instanceClient } from './services/instance/instance.shared'
export type {
  Instance,
  InstanceData,
  InstanceQuery,
  InstancePatch
} from './services/instance/instance.shared'

import { taskClient } from './services/task/task.shared'
export type { Task, TaskData, TaskQuery, TaskPatch } from './services/task/task.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the habit-tracker-node app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(taskClient)
  client.configure(instanceClient)
  client.configure(apiKeyClient)
  return client
}
