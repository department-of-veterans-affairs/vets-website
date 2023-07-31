import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import sinon from 'sinon';
import App from '../App';

const oldWindow = global.window;
const generateInitialState = ({
  loading = false,
  mhvLandingPageEnabled = true,
  serviceName = 'idme',
  profileLoading = false,
  currentlyLoggedIn = true,
  isCernerPatient = false,
  hasFacilities = true,
}) => {
  const facilities = hasFacilities
    ? [{ facilityId: '123', isCerner: false }]
    : [];
  return {
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      mhv_landing_page_enabled: mhvLandingPageEnabled,
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          cernerFacilities: [
            {
              vhaId: '757',
              vamcFacilityName: 'Chalmers P. Wylie Veterans Outpatient Clinic',
              vamcSystemName: 'VA Central Ohio health care',
              ehr: 'cerner',
            },
          ],
        },
      },
    },
    user: {
      login: {
        currentlyLoggedIn,
      },
      profile: {
        loading: profileLoading,
        signIn: {
          serviceName,
        },
        facilities: isCernerPatient
          ? [{ facilityId: '757', isCerner: true }]
          : facilities,
      },
    },
  };
};

const setup = (initialState = {}) => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);
  const state = generateInitialState(initialState);
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
};

describe('MHV landing page', () => {
  describe('App Container', () => {
    afterEach(() => {
      global.window = oldWindow;
    });

    it('feature toggles are still loading -- should show loading indicator', () => {
      const { container } = setup({ loading: true });
      expect(container.querySelector('va-loading-indicator ')).to.exist;
    });

    it('user is not loaded -- should loading indicator', () => {
      const initialState = {
        profileLoading: true,
      };
      const { container } = setup(initialState);
      expect(container.querySelector('va-loading-indicator ')).to.exist;
    });

    it('user is authenticated, but feature is disabled -- should not show the landing page', () => {
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = setup({
        mhvLandingPageEnabled: false,
      });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });

    it('user is authenticated with login gov and feature enabled -- should render landing page', () => {
      const { container } = setup({
        serviceName: CSP_IDS.LOGIN_GOV,
      });
      expect(container.querySelector('h1')).to.exist;
      expect(container.querySelector('h1')).to.have.text('My HealtheVet');
    });

    it('user is authenticated with idme and feature enable -- should renders landing page', () => {
      const { container } = setup({
        serviceName: CSP_IDS.ID_ME,
      });
      expect(container.querySelector('h1')).to.exist;
      expect(container.querySelector('h1')).to.have.text('My HealtheVet');
    });

    it('user is authenticated with MHV and feature enabled -- should not show the landing page', () => {
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = setup({
        serviceName: CSP_IDS.MHV,
      });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });

    it('user is not authenticated and feature enabled -- should not show the landing page', () => {
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = setup({
        currentlyLoggedIn: false,
      });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });

    it('user is a cerner patient and feature enabled -- should not show the landing page', () => {
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = setup({
        serviceName: CSP_IDS.MHV,
        isCerner: true,
      });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });

    it('user is authenticated with feature enabled but has no facilities -- should not show the landing page', () => {
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = setup({
        hasFacilities: false,
      });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });
  });
});
