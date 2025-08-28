import '@department-of-veterans-affairs/virtual-agent/sass/virtual-agent';
import 'platform/polyfills';

import startApp from 'platform/startup';

import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';
import { initLogging } from './utils/logging';

const script = document.createElement('script');
script.nonce = '**CSP_NONCE**';
script.type = 'text/javascript';
script.text =
  'function recordLinkClick(data) {\n' +
  '  console.log("in the script");\n' +
  '  window.dataLayer && window.dataLayer.push(data);\n' +
  '  return false;\n' +
  '};';
document.body.appendChild(script);

initLogging();

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});
