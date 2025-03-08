import 'platform/polyfills';
import './sass/_mock-form-ae-design-patterns.scss';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

import coeReducer from './patterns/pattern2/TaskGray/shared/reducers';
import { asyncStartApp } from './utils/asyncStartApp';

const combinedReducers = {
  ...reducer,
  certificateOfEligibility: coeReducer.certificateOfEligibility,
};

const createRoutes = initialRoutes => {
  // here we can do some async stuff
  // maybe we change the routes based on the state or other api call responses?
  // this could be where we add or remove routes for the contact info that is missing for a user
  // replace () with (store) to access the store and use it to determine the routes
  return () => {
    return initialRoutes;
  };
};

asyncStartApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer: combinedReducers,
  createAsyncRoutesWithStore: createRoutes(routes),
});
