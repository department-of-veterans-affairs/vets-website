import 'platform/polyfills';
import './sass/_mock-form-ae-design-patterns.scss';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

import coeReducer from './patterns/pattern2/TaskRed/shared/reducers';
import { asyncStartApp } from './utils/asyncStartApp';

const combinedReducers = {
  ...reducer,
  certificateOfEligibility: coeReducer.certificateOfEligibility,
};

asyncStartApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer: combinedReducers,
  routes,
});
