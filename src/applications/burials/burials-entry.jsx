import 'platform/polyfills';
import './sass/burials.scss';

import startApp from 'platform/startup';

import routes from './routes';
import routesV2 from './routesV2';
import reducer from './reducer';
import reducerV2 from "./reducerV2";
import manifest from './manifest.json';
import FlipperClient from "@department-of-veterans-affairs/platform-utilities/flipper-client";
import environments from "@department-of-veterans-affairs/platform-utilities/environment";

const { fetchToggleValues } = FlipperClient({ host: environments.API_URL });
fetchToggleValues().then((toggleValues) => {
  const { burialFormV2 } = toggleValues;
  startApp({
    url: manifest.rootUrl,
    reducer: burialFormV2 ? reducerV2 : reducer,
    routes: burialFormV2 ? routesV2 : routes,
    entryName: manifest.entryName,
  });
});
