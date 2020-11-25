import 'platform/polyfills';
import './sass/messages.scss';

import startApp from 'platform/startup';

import routes from './routes';
import { InquiryReducer } from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer: InquiryReducer,
  routes,
});
