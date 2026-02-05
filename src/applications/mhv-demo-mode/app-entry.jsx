import '@department-of-veterans-affairs/platform-polyfills';
import './sass/mhv-demo-mode.scss';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';
import { UPDATE_PROFILE_FIELDS } from 'platform/user/profile/actions';
// import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from 'platform/site-wide/feature-toggles/actionTypes';

import setupMockApi from './utils/mock-api';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';
import { DEMO_MODE_ACKNOWLEDGED } from './constants';

import userFixture from './fixtures/user.json';
import featureTogglesFixture from './fixtures/feature-toggles.json';

setupMockApi();

const store = startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

// Only populate mock user data if the user has acknowledged the demo.
// This prevents showing "logged in as Ginny" on the intro page.
const hasAcknowledged = sessionStorage.getItem(DEMO_MODE_ACKNOWLEDGED);

if (hasAcknowledged) {
  const toggleValues = {};
  featureTogglesFixture.data.features.forEach(toggle => {
    toggleValues[toggle.name] = toggle.value;
  });

  store.dispatch({ type: UPDATE_PROFILE_FIELDS, payload: userFixture });
  // Don't dispatch UPDATE_LOGGEDIN_STATUS so the header shows "Sign in"
  // store.dispatch({ type: UPDATE_LOGGEDIN_STATUS, value: true });
  store.dispatch({
    type: FETCH_TOGGLE_VALUES_SUCCEEDED,
    payload: toggleValues,
  });
}
