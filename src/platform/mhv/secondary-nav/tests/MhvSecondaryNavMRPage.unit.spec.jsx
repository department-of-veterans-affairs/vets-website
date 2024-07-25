import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import MhvSecondaryNav, { mhvSecNavItems } from '../containers/MhvSecondaryNav';

const mockStore = ({
  mhvSecondaryNavigationEnabled = false,
  mhvTransitionalMedicalRecordsLandingPage = false,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      loading: false,
      mhvSecondaryNavigationEnabled,
      // eslint-disable-next-line camelcase
      mhv_secondary_navigation_enabled: mhvSecondaryNavigationEnabled,
      mhvTransitionalMedicalRecordsLandingPage,
      // eslint-disable-next-line camelcase
      mhv_transitional_medical_records_landing_page: mhvTransitionalMedicalRecordsLandingPage,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('MHV Secondary Nav Component', () => {
  describe('transitional Medical Records page -- enabled', () => {
    it('renders the /my-health/records link', async () => {
      const store = mockStore({
        mhvSecondaryNavigationEnabled: true,
        mhvTransitionalMedicalRecordsLandingPage: true,
      });
      const { findByRole } = render(
        <Provider store={store}>
          <MhvSecondaryNav items={mhvSecNavItems} />
        </Provider>,
      );
      const result = await findByRole('link', { name: /Records$/ });
      expect(result.getAttribute('href')).to.eq('/my-health/records');
    });
  });

  describe('transitional Medical Records page -- disabled', () => {
    it('renders the /my-health/medical-records link', async () => {
      const store = mockStore({
        mhvSecondaryNavigationEnabled: true,
        mhvTransitionalMedicalRecordsLandingPage: false,
      });
      const { findByRole } = render(
        <Provider store={store}>
          <MhvSecondaryNav items={mhvSecNavItems} />
        </Provider>,
      );
      const result = await findByRole('link', { name: /Records$/ });
      expect(result.getAttribute('href')).to.eq('/my-health/medical-records');
    });
  });
});
