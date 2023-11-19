/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on VA.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { connectDrupalSourceOfTruthCerner } from 'platform/utilities/cerner/dsot';
import startReactApp from '../../startup/react';
import Main from './containers/Main';
import Form526Entry from '~/applications/disability-benefits/all-claims/Form526EZApp';
import { WIZARD_STATUS_COMPLETE } from '~/platform/site-wide/wizard';
import { WIZARD_STATUS } from '~/applications/disability-benefits/all-claims/constants';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { commonReducer } from '~/platform/startup/store';
import reducers from '~/applications/disability-benefits/all-claims/reducers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { requestStates } from '~/platform/utilities/constants';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startMegaMenuWidget(data, store) {
  connectDrupalSourceOfTruthCerner(store.dispatch);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const initialState = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          verified: true,
          services: [backendServices.ORIGINAL_CLAIMS],
          dob: '2000-01-01',
        },
      },
      featureToggles: {
        [Toggler.TOGGLE_NAMES.disability526ReducedContentionList]: true,
        show526Wizard: true,
      },
    };

  const fakeStore = createStore(
    combineReducers({
      ...commonReducer,
      ...reducers,
    }),
    initialState,
  );

  startReactApp(
    <Provider store={fakeStore}>
    <Form526Entry
        location={{ pathname: '/new-disabilities/add', search: '' }}
        itf={{ fetchCallState: requestStates.succeeded }}
      >
        <></>
      </Form526Entry>
      <Main megaMenuData={data} />
    </Provider>,
    document.getElementById('mega-menu'),
  );
}