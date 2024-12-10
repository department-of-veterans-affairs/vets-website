import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
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
  it('renders nothing when loading', async () => {
    const initialState = stateFn({ loading: true });
    const { container } = setup({ initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders', () => {
    const { getByRole } = setup();
    const mrLink = getByRole('link', { name: /^Records/ });
    expect(mrLink.href).to.match(/my-health\/medical-records$/);
  });

  describe('Medical Records href', () => {
    it('when no features set: /my-health/medical-records', () => {
      const { getByRole } = setup();
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });

    it('when mhvTransitionalMedicalRecordsLandingPage enabled: /my-health/records', () => {
      const initialState = stateFn({
        mhvTransitionalMedicalRecordsLandingPage: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/records$/);
    });

    it('when both toggles enabled: /my-health/medical-records', () => {
      const initialState = stateFn({
        mhvTransitionalMedicalRecordsLandingPage: true,
        mhvIntegrationMedicalRecordsToPhase1: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });

    it('when mhvIntegrationMedicalRecordsToPhase1 enabled: /my-health/medical-records', () => {
      const initialState = stateFn({
        mhvIntegrationMedicalRecordsToPhase1: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });
  });
});
