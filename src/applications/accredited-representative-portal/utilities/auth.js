import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import api from './api';
import mockApi, { configure as configureMockApi } from './mockApi';
import store from './store';

/**
 * `userPromise` is a singleton that is created when the app is created. It has
 * a dependency on the mock API being set up to determine whether it gets a user
 * from mock or real data.
 */
configureMockApi();

export const userPromise = (async () => {
  try {
    const userResponse = await api.getUser();
    const user = await userResponse.json();

    /**
     * If using a mock API response for `getUser`, the dev should also disable
     * authentication in their local server's API routes. This makes token
     * refreshing unnecessary. It isn't strictly necessary to skip this code
     * when mocking `getUser`, but we do so anyway for documentation purposes.
     */
    if (api.getUser !== mockApi.getUser) {
      /**
       * This is an even stricter success condition than having a user. We
       * additionally require what is needed for access token refreshing to
       * function.
       */
      const serviceName = user?.profile?.signIn?.serviceName;
      if (!serviceName)
        throw new Error('Missing user with sign in service name.');

      /**
       * Needed for access token refreshing to function.
       */
      sessionStorage.setItem('serviceName', serviceName);
    }

    return user;
  } catch (e) {
    return null;
  } finally {
    /**
     * Platform's Flipper client doesn't attempt to refresh expired access
     * tokens, so feature toggles simply don't load when the user's access token
     * expires.
     *
     * To get around this for now, we make the feature toggle fetch occur
     * serially after our user fetch singleton which _does_ refresh access
     * tokens before replaying the fetch.
     *
     * TODO: Find something less hacky.
     */
    connectFeatureToggle(store.dispatch);
  }
})();
