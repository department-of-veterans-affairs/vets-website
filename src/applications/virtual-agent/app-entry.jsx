import '@department-of-veterans-affairs/virtual-agent/webchat/sass/virtual-agent.scss';
import 'platform/polyfills';

import startApp from 'platform/startup';

import manifest from './manifest.json';
import reducer from './webchat/reducers';
import routes from './webchat/routes';
import { initLogging } from './webchat/utils/logging';

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
