import '@department-of-veterans-affairs/virtual-agent/bf-webchat/sass/virtual-agent.scss';
import 'platform/polyfills';

import startApp from 'platform/startup';

import reducer from './bf-webchat/reducers';
import routes from './bf-webchat/routes';
import { initLogging } from './bf-webchat/utils/logging';
import manifest from './manifest.json';

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
