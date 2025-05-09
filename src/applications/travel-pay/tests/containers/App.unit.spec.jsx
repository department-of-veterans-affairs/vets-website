import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import MockDate from 'mockdate';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import reducer from '../../redux/reducer';
import App from '../../containers/App';

describe('App', () => {
  const oldLocation = global.window.location;
  const getData = ({
    areFeatureTogglesLoading = false,
    hasFeatureFlag = true,
    hasClaimDetailsFeatureFlag = true,
    isLoggedIn = true,
    isLOA3 = true,
    signInServiceName = '',
  } = {}) => {
    return {
      featureToggles: {
        loading: areFeatureTogglesLoading,
        /* eslint-disable camelcase */
        travel_pay_power_switch: hasFeatureFlag,
        travel_pay_view_claim_details: hasClaimDetailsFeatureFlag,
        /* eslint-enable camelcase */
      },
      user: {
        login: {
          currentlyLoggedIn: isLoggedIn,
        },
        profile: {
          signIn: {
            serviceName: signInServiceName,
          },
          services: [backendServices.USER_PROFILE],
          loa: {
            current: isLOA3 ? 3 : 1,
            highest: isLOA3 ? 3 : 1,
          },
          multifactor: true,
          verified: !!isLOA3,
        },
      },
    };
  };

  beforeEach(() => {
    global.window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    global.window.location = oldLocation;
    MockDate.reset();
  });

  it('should redirect if user not logged in', async () => {
    renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: false,
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  // TODO: find a better way to test this
  it('should render the MHV nav and Outlet if user is logged in', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    // This tests that the MHV nav is present
    expect(await screen.findAllByText(/My HealtheVet/i)).to.exist;
  });

  it('should render a verify identity message if user is not LOA3', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
        isLOA3: false,
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    expect($('va-alert-sign-in')).to.exist;
    expect(screen.getAllByText(/verify with/i)).to.exist;
  });

  it('should render a verify identity message for logingov sign in service if user is not LOA3', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
        isLOA3: false,
        signInServiceName: 'logingov',
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    expect($('va-alert-sign-in[variant="verifyLoginGov"]')).to.exist;
    expect(screen.getByText(/login.gov/i)).to.exist;
  });

  it('should render a verify identity message for idme sign in service if user is not LOA3', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
        isLOA3: false,
        signInServiceName: 'idme',
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    expect($('va-alert-sign-in[variant="verifyIdMe"]')).to.exist;
    expect(screen.getByText(/id.me/i)).to.exist;
  });
});
