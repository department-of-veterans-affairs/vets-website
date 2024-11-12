import manifest from './manifest.json';
import { startFormEngineFormApp } from '../shared/utils/startApp';

startFormEngineFormApp({
  formId: '21-4140',
  rootUrl: manifest.rootUrl,
  trackingPrefix: '21-4140-eq-',
});
