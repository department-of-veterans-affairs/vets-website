/* eslint-disable camelcase */
import React from 'react';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import LandingPage from '../../components/LandingPage';
import reducers from '../../reducers';
import VerifyAndRegisterAlert from '../../components/VerifyAndRegisterAlert';

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
    const { getByRole } = setup();
    getByRole('heading', { level: 1, name: /My HealtheVet/ });
  });

  it('shows the Welcome component, when enabled', () => {
    const initialState = stateFn({ mhv_landing_page_personalization: true });
    const { getByRole } = setup({ initialState });
    getByRole('heading', { level: 2, name: /Welcome/ });
  });

  it('shows an alert when user is unregistered', () => {
    const initialState = stateFn({ vaPatient: false });
    const { getByText } = setup({ initialState });
    getByText('You don’t have access to My HealtheVet');
  });

  it('shows an alert when user is unverified', () => {
    const initialState = stateFn({ loa: 1, serviceName: 'idme' });
    const { getByText } = setup({ initialState });
    getByText(
      'Verify your identity to use your ID.me account on My HealtheVet',
    );
  });

  it('shows the MhvBasicAccountAlert', async () => {
    const initialState = stateFn({ loa: 1, serviceName: 'mhv' });
    const { getByText } = setup({ initialState });
    await waitFor(() => {
      getByText(
        'You need to sign in with a different account to access My HealtheVet',
      );
    });
  });

  it('shows the VerifyAndRegisterAlert', async () => {
    const initialState = stateFn();
    const props = { showVerifyAndRegisterAlert: () => true };
    const { getByTestId } = setup({ initialState, props });
    await waitFor(() => {
      expect(getByTestId(VerifyAndRegisterAlert.defaultProps.testId)).to.exist;
    });
  });

  it('does not show the VerifyAndRegisterAlert', async () => {
    const initialState = stateFn();
    const props = { showVerifyAndRegisterAlert: () => false };
    const { queryByTestId } = setup({ initialState, props });
    await waitFor(() => {
      expect(queryByTestId(VerifyAndRegisterAlert.defaultProps.testId)).to.be
        .null;
    });
  });

  it('reports unverified condition to GA via recordEvent', async () => {
    const loa1Event = {
      ...event,
      'alert-box-headline':
        'Verify your identity to use your Login.gov account on My HealtheVet',
    };
    const recordEventSpy = sinon.spy();
    const props = { recordEvent: recordEventSpy };
    const initialState = stateFn({ loa: 1, serviceName: 'logingov' });
    setup({ initialState, props });
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.calledWith(loa1Event)).to.be.true;
    });
  });
});
