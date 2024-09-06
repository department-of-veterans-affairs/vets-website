/* eslint-disable camelcase */
import React from 'react';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import { expect } from 'chai';
import LandingPage from '../../components/LandingPage';
import reducers from '../../reducers';

const stateFn = ({
  mhv_landing_page_personalization = false,
  mhv_integration_medical_records_to_phase_1 = false,
  loa = 3,
  serviceName = 'logingov',
  vaPatient = true,
} = {}) => ({
  featureToggles: {
    mhv_landing_page_personalization,
    mhv_integration_medical_records_to_phase_1,
  },
  user: {
    profile: {
      userFullName: {
        first: 'Sam',
      },
      loa: { current: loa },
      signIn: { serviceName },
      vaPatient,
      mhvAccountState: 'OK',
    },
  },
});

const setup = ({ initialState = stateFn(), props = {} } = {}) =>
  renderInReduxProvider(<LandingPage {...props} />, { initialState, reducers });

describe('LandingPage component', () => {
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { level: 1, name: /My HealtheVet/ });
  });

  it('shows the Welcome component, when enabled', () => {
    const initialState = stateFn({ mhv_landing_page_personalization: true });
    const { getByRole } = setup({ initialState });
    getByRole('heading', { level: 2, name: /Welcome/ });
  });

  describe('learn more expandable alert', () => {
    it('shows when MR Phase 1 toggle is not enabled', () => {
      const { getByTestId } = setup();
      getByTestId('learn-more-alert');
    });

    it('does not show when MR Phase 1 toggle is enabled', () => {
      const initialState = stateFn({
        mhv_integration_medical_records_to_phase_1: true,
      });
      const { queryByTestId } = setup({ initialState });
      expect(queryByTestId('learn-more-alert')).to.be.null;
    });
  });
});
