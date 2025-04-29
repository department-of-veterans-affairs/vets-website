/* eslint-disable camelcase */
import React from 'react';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import LandingPage from '../../components/LandingPage';
import reducers from '../../reducers';

const stateFn = ({
  mhv_landing_page_personalization = false,
  loa = 3,
  serviceName = 'logingov',
  vaPatient = true,
} = {}) => ({
  featureToggles: {
    mhv_landing_page_personalization,
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
});
