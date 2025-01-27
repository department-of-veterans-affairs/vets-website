import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MhvSecondaryNav from '../containers/MhvSecondaryNav';

const stateFn = ({
  loading,
  mhvIntegrationMedicalRecordsToPhase1 = false,
} = {}) => ({
  featureToggles: {
    loading,
    mhvIntegrationMedicalRecordsToPhase1,
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<MhvSecondaryNav />, { initialState });

describe('<MhvSecondaryNav />', () => {
  it('is hidden when state.featureToggles is unset', () => {
    const { getByRole } = setup({ initialState: {} });
    const nav = getByRole('navigation', { name: 'My HealtheVet' });
    const isHidden = nav.classList.contains('vads-u-visibility--hidden');
    expect(isHidden).to.be.true;
  });

  it('is hidden when state.featureToggles.loading', () => {
    const initialState = stateFn({ loading: true });
    const { getByRole } = setup({ initialState });
    const nav = getByRole('navigation', { name: 'My HealtheVet' });
    const isHidden = nav.classList.contains('vads-u-visibility--hidden');
    expect(isHidden).to.be.true;
  });

  it('is hidden when state.featureToggles.loading is undefined', () => {
    const initialState = stateFn({ loading: undefined });
    const { getByRole } = setup({ initialState });
    const nav = getByRole('navigation', { name: 'My HealtheVet' });
    const isHidden = nav.classList.contains('vads-u-visibility--hidden');
    expect(isHidden).to.be.true;
  });

  it('renders', () => {
    const initialState = stateFn({ loading: false });
    const { getByRole } = setup({ initialState });
    const nav = getByRole('navigation', { name: 'My HealtheVet' });
    const isHidden = nav.classList.contains('vads-u-visibility--hidden');
    expect(isHidden).to.be.false;
    const mhvLink = getByRole('link', { name: /^My HealtheVet/ });
    expect(mhvLink.href).to.match(/my-health$/);
  });

  describe('Medical Records href', () => {
    it('when toggle enabled:\n\t /my-health/medical-records', () => {
      const initialState = stateFn({
        loading: false,
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
