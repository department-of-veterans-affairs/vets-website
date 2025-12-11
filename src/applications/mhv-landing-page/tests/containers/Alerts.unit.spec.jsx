import React from 'react';
import { expect } from 'chai';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import Alerts from '../../containers/Alerts';
import reducers from '../../reducers';

const stateFn = ({
  loa = 3,
  mhvAccountState = 'OK',
  serviceName = CSP_IDS.LOGIN_GOV,
  vaPatient = true,
  accountStatusErrors = null,
  ssoe = false,
} = {}) => ({
  user: {
    profile: {
      loa: { current: loa },
      mhvAccountState,
      signIn: { serviceName },
      vaPatient,
      session: {
        ssoe,
      },
    },
  },
  myHealth: {
    accountStatus: {
      data: accountStatusErrors,
      loading: false,
      error: false,
    },
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<Alerts />, { initialState, reducers });

describe('<Alerts /> container', () => {
  it('renders nothing', () => {
    const { container } = setup();
    expect(container).to.be.empty;
  });

  it('renders <AlertVerifyAndRegister />', () => {
    const initialState = stateFn({ loa: 1, serviceName: CSP_IDS.ID_ME });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--verify-and-register');
    expect(getAllByTestId(/^mhv-alert--/).length).to.eq(1);
  });

  it('renders <AlertUnregistered />', () => {
    const initialState = stateFn({ vaPatient: false });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--unregistered');
    expect(getAllByTestId(/^mhv-alert--/).length).to.eq(1);
  });

  it('renders <AlertUnregistered /> when renderVerifyAndRegisterAlert is false but !userRegistered', () => {
    // renderVerifyAndRegisterAlert is false when loa is 3 or serviceName is not ID_ME/LOGIN_GOV
    // !userRegistered when vaPatient is false
    const initialState = stateFn({
      loa: 3,
      vaPatient: false,
      serviceName: CSP_IDS.MHV, // Not ID_ME or LOGIN_GOV, so renderVerifyAndRegisterAlert is false
    });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--unregistered');
    expect(getAllByTestId(/^mhv-alert--/).length).to.eq(1);
  });

  it('returns empty fragment when all conditions are false', () => {
    // All conditions false means:
    // - renderVerifyAndRegisterAlert is false (loa is 3, not ID_ME/LOGIN_GOV)
    // - userRegistered is true (loa is 3 and vaPatient is true)
    // - mhvAccountStatusSortedErrors.length === 0 (no errors)
    const initialState = stateFn({
      loa: 3,
      vaPatient: true,
      serviceName: CSP_IDS.MHV,
      accountStatusErrors: null,
    });
    const { container } = setup({ initialState });
    expect(container).to.be.empty;
  });
});
