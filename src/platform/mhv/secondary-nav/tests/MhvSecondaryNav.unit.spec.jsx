import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MhvSecondaryNav from '../containers/MhvSecondaryNav';

const stateFn = ({
  loading = false,
  mhvTransitionalMedicalRecordsLandingPage = false,
  mhvIntegrationMedicalRecordsToPhase1 = false,
} = {}) => ({
  featureToggles: {
    loading,
    mhvTransitionalMedicalRecordsLandingPage,
    mhvIntegrationMedicalRecordsToPhase1,
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<MhvSecondaryNav />, { initialState });

describe('<MhvSecondaryNav />', () => {
  it('renders nothing when loading', () => {
    const initialState = stateFn({ loading: true });
    const { container } = setup({ initialState });
    expect(container).to.be.empty;
  });

  it('renders', () => {
    const { getByRole } = setup();
    getByRole('navigation', { name: 'My HealtheVet' });
    const mrLink = getByRole('link', { name: /^My HealtheVet/ });
    expect(mrLink.href).to.match(/my-health$/);
  });

  describe('Medical Records href', () => {
    it('when no features set:\n\t /my-health/medical-records', () => {
      const { getByRole } = setup();
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });

    it('when mhvTransitionalMedicalRecordsLandingPage enabled:\n\t /my-health/records', () => {
      const initialState = stateFn({
        mhvTransitionalMedicalRecordsLandingPage: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/records$/);
    });

    it('when both toggles enabled:\n\t /my-health/medical-records', () => {
      const initialState = stateFn({
        mhvTransitionalMedicalRecordsLandingPage: true,
        mhvIntegrationMedicalRecordsToPhase1: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });

    it('when mhvIntegrationMedicalRecordsToPhase1 enabled:\n\t /my-health/medical-records', () => {
      const initialState = stateFn({
        mhvIntegrationMedicalRecordsToPhase1: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });
  });
});
