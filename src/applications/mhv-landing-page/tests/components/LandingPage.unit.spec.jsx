/* eslint-disable camelcase */
import React from 'react';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
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

const event = {
  event: 'nav-alert-box-load',
  action: 'load',
  'alert-box-headline': '',
  'alert-box-status': 'continue',
};

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

  it('reports LOA1 condition to GA via recordEvent', async () => {
    const loa1Event = {
      ...event,
      'alert-box-headline':
        'Verify your identity to use your Login.gov account on My HealtheVet',
    };
    const recordEventSpy = sinon.spy();
    const props = { recordEvent: recordEventSpy };
    const initialState = stateFn({ loa: 1, facilities: [] });
    setup({ initialState, props });
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.calledWith(loa1Event)).to.be.true;
    });
  });
});
