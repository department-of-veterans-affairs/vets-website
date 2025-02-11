import manifest from './manifest.json';
import startFormEngineApp from '../shared/utils/startApp';

startFormEngineApp({
  formId: '21-4140',
  rootUrl: manifest.rootUrl,
  trackingPrefix: '21-4140-eq-',
});
