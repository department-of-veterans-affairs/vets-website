import 'platform/polyfills';
import './sass/pre-need.scss';

import startApp from 'platform/startup';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import routes from './routes';
import reducer from './reducer';
import manifest from './manifest.json';

async function loadFeatureToggles() {
  const response = await fetch(`${environment.API_URL}/v0/feature_toggles`);
  if (!response.ok) {
    throw new Error('Failed to load feature toggles');
  }
  return response.json();
}

async function initializeApp() {
  let toggles = {};
  try {
    toggles = await loadFeatureToggles();
  } catch (err) {
    toggles = {};
  }

  const features = toggles.data?.features || [];
  const targetFeature = features.find(
    feature => feature.name === 'showMbsPreneedChangeVA4010007',
  );

  const url = targetFeature?.value
    ? '/burials-and-memorials/pre-need-integration'
    : manifest.rootUrl;

  startApp({
    url,
    reducer,
    routes,
    entryName: manifest.entryName,
  });
}

initializeApp();
