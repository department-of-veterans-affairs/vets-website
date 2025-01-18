import 'platform/polyfills';
import './sass/form-upload.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import { buildManifest } from './manifest-helpers';

const formUploadForms = ['21-0779', '21-509'];

formUploadForms.forEach(formNumber => {
  startApp({
    url: buildManifest(formNumber).rootUrl,
    reducer,
    routes,
  });
});
