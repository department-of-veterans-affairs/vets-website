/* eslint-disable camelcase */
import React from 'react';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import LandingPage from '../../components/LandingPage';
import reducers from '../../reducers';

const stateFn = ({
  mhv_landing_page_personalization = false,
  facilities = [{ facilityId: 983, isCerner: false }],
  loa = 3,
  serviceName = 'logingov',
} = {}) => ({
  featureToggles: {
    mhv_landing_page_personalization,
  },
  user: {
    profile: {
      userFullName: {
        first: 'Sam',
      },
      facilities,
      loa: { current: loa },
      signIn: { serviceName },
    },
  },
});

const setup = ({ initialState = stateFn(), props = {} } = {}) =>
  renderInReduxProvider(<LandingPage {...props} />, { initialState, reducers });

describe('LandingPage component', () => {
  it('renders', () => {
    const { getByText } = setup();
    getByText('My HealtheVet');
  });

  it('shows the Welcome component, when enabled', () => {
    const initialState = stateFn({ mhv_landing_page_personalization: true });
    const { getByRole } = setup({ initialState });
    getByRole('heading', { level: 2, name: /Welcome/ });
  });

  it('shows an alert when user has no facilities (aka no health data)', () => {
    const initialState = stateFn({ facilities: [] });
    const { getByText } = setup({ initialState });
    getByText('You don’t have access to My HealtheVet');
  });

  it('shows an alert when user is LOA1', () => {
    const initialState = stateFn({ loa: 1, serviceName: 'idme' });
    const { getByText } = setup({ initialState });
    getByText(
      'Verify your identity to use your ID.me account on My HealtheVet',
    );
  });
});
