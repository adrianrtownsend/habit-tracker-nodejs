import { OAuthProfile } from '@feathersjs/authentication-oauth'
import { OAuthParams } from '@feathersjs/authentication-oauth/lib/service'
import { Application } from '@feathersjs/feathers'

const firebase = require('firebase-admin')
const { OAuthStrategy } = require('@feathersjs/authentication-oauth')
const { NotAuthenticated } = require('@feathersjs/errors')

const logger = require('./logger')

/**
 * Initialize the Firebase Admin SDK.
 *
 * @param app - The Feathers application instance.
 */
function initialize(app: Application): void {
  const firebaseConfig = app.get('firebase')

  // Initialize app
  try {
    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig)
    })
  } catch (e) {
    console.error('Error initializing firebase', e)
  }
}

class FirebaseStrategy extends OAuthStrategy {
  /**
   * Authenticate with the Firebase authentication service.
   *
   * @param authentication The authentication details.
   * @param params The authentication parameters.
   * @returns The authentication result.
   */
  async authenticate(authentication: any, params: OAuthParams) {
    logger.debug('firebase:strategy:authenticate')
    return super.authenticate(authentication, params)
  }

  /**
   * The `getProfile` method is used to map the external authentication
   * service profile to an entity. The entity is the internal representation
   * of a user.
   *
   * @param data The external authentication service profile.
   * @param _params Unused.
   * @returns The entity data.
   */
  async getProfile(data: { access_token: string }, _params: unknown) {
    const firebase = require('firebase-admin')
    let user

    try {
      user = await firebase.auth().verifyIdToken(data.access_token)
    } catch (e) {
      logger.error(e)
      throw new NotAuthenticated()
    }

    logger.debug(`firebase:strategy:getProfile:successful ${user.user_id}`)

    return {
      email: user.email,
      id: user.user_id
    }
  }

  /**
   * The `getEntityData` method is used to map the external authentication
   * service profile to an entity. The entity is the internal representation
   * of a user.
   *
   * @param profile The external authentication service profile.
   * @returns The entity data.
   */
  async getEntityData(profile: OAuthProfile) {
    const baseData = await super.getEntityData(profile)

    return {
      ...baseData,
      email: profile.email
    }
  }
}

module.exports = { initialize, FirebaseStrategy }
