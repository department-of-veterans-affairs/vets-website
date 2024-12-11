import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MhvSecondaryNav from '../containers/MhvSecondaryNav';

const stateFn = ({
  loading,
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
  it('renders nothing when state.featureToggles is unset', () => {
    const { container } = setup({ initialState: {} });
    expect(container).to.be.empty;
  });

  it('renders nothing when loading features', () => {
    const initialState = stateFn({ loading: true });
    const { container } = setup({ initialState });
    expect(container).to.be.empty;
  });

  it('renders nothing when loading is undefined', () => {
    const initialState = stateFn({ loading: undefined });
    const { container } = setup({ initialState });
    expect(container).to.be.empty;
  });

  it('renders', () => {
    const initialState = stateFn({ loading: false });
    const { getByRole } = setup({ initialState });
    getByRole('navigation', { name: 'My HealtheVet' });
    const mrLink = getByRole('link', { name: /^My HealtheVet/ });
    expect(mrLink.href).to.match(/my-health$/);
  });

  describe('Medical Records href', () => {
    it('when no features set:\n\t /my-health/medical-records', () => {
      const initialState = stateFn({ loading: false });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });

    it('when mhvTransitionalMedicalRecordsLandingPage enabled:\n\t /my-health/records', () => {
      const initialState = stateFn({
        loading: false,
        mhvTransitionalMedicalRecordsLandingPage: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/records$/);
    });

    it('when both toggles enabled:\n\t /my-health/medical-records', () => {
      const initialState = stateFn({
        loading: false,
        mhvTransitionalMedicalRecordsLandingPage: true,
        mhvIntegrationMedicalRecordsToPhase1: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });

    it('when mhvIntegrationMedicalRecordsToPhase1 enabled:\n\t /my-health/medical-records', () => {
      const initialState = stateFn({
        loading: false,
        mhvIntegrationMedicalRecordsToPhase1: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Records/ });
      expect(mrLink.href).to.match(/my-health\/medical-records$/);
    });
  });
});
