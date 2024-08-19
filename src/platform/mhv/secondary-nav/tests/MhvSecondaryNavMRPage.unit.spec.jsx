import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import MhvSecondaryNav, { mhvSecNavItems } from '../containers/MhvSecondaryNav';

const mockStore = ({
  mhvTransitionalMedicalRecordsLandingPage = false,
  mhvMedicalRecordsPhase1Launch = false,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      loading: false,
      mhvTransitionalMedicalRecordsLandingPage,
      mhvMedicalRecordsPhase1Launch,
      // eslint-disable-next-line camelcase
      mhv_transitional_medical_records_landing_page: mhvTransitionalMedicalRecordsLandingPage,
      // eslint-disable-next-line camelcase
      mhv_medical_records_phase_1_launch: mhvMedicalRecordsPhase1Launch,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('MHV Secondary Nav Component', () => {
  describe('transitional Medical Records page -- enabled', () => {
    it('renders the /my-health/records link', async () => {
      const store = mockStore({
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

  describe('Medical Records phase 1 rollout', () => {
    const testForLink = async store => {
      const { findByRole } = render(
        <Provider store={store}>
          <MhvSecondaryNav items={mhvSecNavItems} />
        </Provider>,
      );
      const link = await findByRole('link', { name: /Records$/ });
      expect(link.getAttribute('href')).to.eq('/my-health/medical-records');
    };

    it('phase 1 only toggle enabled', async () => {
      const store = mockStore({
        mhvMedicalRecordsPhase1Launch: true,
        mhvTransitionalMedicalRecordsLandingPage: false,
      });
      testForLink(store);
    });

    it('phase 1 toggle enabled takes precedence over transitional page', async () => {
      const store = mockStore({
        mhvMedicalRecordsPhase1Launch: true,
        mhvTransitionalMedicalRecordsLandingPage: true,
      });
      testForLink(store);
    });

    it('feature toggles disabled', async () => {
      const store = mockStore({
        mhvMedicalRecordsPhase1Launch: false,
        mhvTransitionalMedicalRecordsLandingPage: false,
      });
      testForLink(store);
    });
  });
});
