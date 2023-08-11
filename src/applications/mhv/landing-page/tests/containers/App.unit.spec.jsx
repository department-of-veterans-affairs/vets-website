import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import App from '../../containers/App';

const featureTogglesFn = ({
  loading = false,
  mhvLandingPageEnabled = true,
} = {}) => ({
  loading,
  // eslint-disable-next-line camelcase
  mhv_landing_page_enabled: mhvLandingPageEnabled,
});

const drupalStaticDataFn = ({ loading = false } = {}) => ({
  vamcEhrData: {
    loading,
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
});

const userFn = ({
  currentlyLoggedIn = true,
  facilities = [{ facilityId: '1', isCerner: false }],
  loading = false,
  serviceName = CSP_IDS.ID_ME,
} = {}) => ({
  login: {
    currentlyLoggedIn,
  },
  profile: {
    loading,
    facilities,
    signIn: {
      serviceName,
    },
  },
});

const setup = ({
  drupalStaticData = drupalStaticDataFn(),
  featureToggles = featureTogglesFn(),
  user = userFn(),
} = {}) => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const state = {
    drupalStaticData,
    featureToggles,
    user,
  };
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
};

let replace;
let originalWindow;

describe('MHV landing page', () => {
  describe('App Container', () => {
    beforeEach(() => {
      originalWindow = global.window;
      replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('feature toggles are still loading -- should show loading indicator', () => {
      const drupalStaticData = drupalStaticDataFn({ loading: true });
      const { container } = setup({ drupalStaticData });
      expect(replace.called).to.be.false;
      expect(container.querySelector('h1')).to.not.exist;
      expect(container.querySelector('va-loading-indicator')).to.exist;
    });

    it('user is not loaded -- should loading indicator', () => {
      const user = userFn({ loading: true });
      const { container } = setup({ user });
      expect(container.querySelector('va-loading-indicator')).to.exist;
    });

    it('user is authenticated, but feature is disabled -- should not show the landing page', () => {
      const featureToggles = featureTogglesFn({ mhvLandingPageEnabled: false });
      const { container } = setup({ featureToggles });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });

    it('user is authenticated with login gov and feature enabled -- should renders landing page', () => {
      const user = userFn({ serviceName: CSP_IDS.LOGIN_GOV });
      const { container } = setup({ user });
      expect(container.querySelector('h1')).to.have.text('My HealtheVet');
    });

    it('user is authenticated with idme and feature enable -- should renders landing page', () => {
      const { container } = setup();
      expect(container.querySelector('h1')).to.exist;
      expect(container.querySelector('h1')).to.have.text('My HealtheVet');
    });

    it('user is authenticated withMHV and feature enabled -- should not show the landing page', () => {
      const user = userFn({ serviceName: CSP_IDS.MHV });
      const { container } = setup({ user });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });

    it('user is not authenticated and feature enabled -- should not show the landing page', () => {
      const user = userFn({ currentlyLoggedIn: false });
      const { container } = setup({ user });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });

    it('user is a cerner patient and feature enabled -- should not show the landing page', () => {
      const user = userFn({
        facilities: [{ facilityId: '757', isCerner: true }],
      });
      const { container } = setup({ user });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });

    it('user is authenticated with feature enabled but has no facilities -- should not show the landing page', () => {
      const user = userFn({ facilities: [] });
      const { container } = setup({ user });
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });
  });
});
