import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MhvSecondaryNav from '../containers/MhvSecondaryNav';

const stateFn = ({
  loading,
  mhvMedicationsRemoveLandingPage = false,
  mhvSecureMessagingRemoveLandingPage = false,
} = {}) => ({
  featureToggles: {
    loading,
    mhvMedicationsRemoveLandingPage,
    mhvSecureMessagingRemoveLandingPage,
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

  describe('Secure Messages href', () => {
    it('when no features set:\n\t /my-health/secure-messages', () => {
      const initialState = stateFn({ loading: false });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Messages/ });
      expect(mrLink.href).to.match(/my-health\/secure-messages$/);
    });

    it('when mhvSecureMessagingRemoveLandingPage enabled:\n\t my-health/secure-messages/inbox', () => {
      const initialState = stateFn({
        loading: false,
        mhvSecureMessagingRemoveLandingPage: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Messages/ });
      expect(mrLink.href).to.match(/my-health\/secure-messages\/inbox$/);
    });
  });

  describe('Medications href', () => {
    it('when no features set:\n\t /my-health/medications/about', () => {
      const initialState = stateFn({ loading: false });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Medications/ });
      expect(mrLink.href).to.match(/my-health\/medications\/about$/);
    });

    it('when mhvMedicationsRemoveLandingPage enabled:\n\t my-health/medications', () => {
      const initialState = stateFn({
        loading: false,
        mhvMedicationsRemoveLandingPage: true,
      });
      const { getByRole } = setup({ initialState });
      const mrLink = getByRole('link', { name: /^Medications/ });
      expect(mrLink.href).to.match(/my-health\/medications$/);
    });
  });
});
