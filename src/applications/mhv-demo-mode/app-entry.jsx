import '@department-of-veterans-affairs/platform-polyfills';
import './sass/mhv-demo-mode.scss';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';
import { UPDATE_PROFILE_FIELDS } from 'platform/user/profile/actions';
import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from 'platform/site-wide/feature-toggles/actionTypes';

import setupMockApi from './utils/mock-api';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

import userFixture from './fixtures/user.json';
import featureTogglesFixture from './fixtures/feature-toggles.json';

setupMockApi();

const store = startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

// Pre-populate the Redux store with mock user and feature toggle data
// so the app renders as if a verified VA patient is logged in.
const toggleValues = {};
featureTogglesFixture.data.features.forEach(toggle => {
  toggleValues[toggle.name] = toggle.value;
});

store.dispatch({ type: UPDATE_PROFILE_FIELDS, payload: userFixture });
store.dispatch({ type: UPDATE_LOGGEDIN_STATUS, value: true });
store.dispatch({ type: FETCH_TOGGLE_VALUES_SUCCEEDED, payload: toggleValues });
