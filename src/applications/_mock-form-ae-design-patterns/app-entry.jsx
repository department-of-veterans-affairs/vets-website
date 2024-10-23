import 'platform/polyfills';
import './sass/_mock-form-ae-design-patterns.scss';

import startApp from 'platform/startup';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

import coeReducer from './patterns/pattern2/TaskGray/shared/reducers';

const combinedReducers = {
  ...reducer,
  certificateOfEligibility: coeReducer.certificateOfEligibility,
};

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer: combinedReducers,
  routes,
});
