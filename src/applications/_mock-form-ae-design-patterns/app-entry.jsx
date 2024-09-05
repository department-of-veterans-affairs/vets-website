import 'platform/polyfills';
import './sass/_mock-form-ae-design-patterns.scss';

import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import { normalRoute, experimentalRoute } from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

import { asyncStartApp } from './asyncStartApp';

asyncStartApp({
  createRoutesWithStore: async store => {
    await connectFeatureToggle(store.dispatch);

    if (store.getState().featureToggles.profileUseExperimental) {
      return experimentalRoute;
    }

    return normalRoute;
  },
  reducer,
  entryName: manifest.entryName,
  url: manifest.rootUrl,
})
  .then(() => {
    // console.log('App started successfully', store);
  })
  .catch(() => {
    // console.error('Error starting app:', error);
  });
