import React from 'react';
import { expect } from 'chai';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import Alerts from '../../containers/Alerts';
import {
  accountStatusMultiError,
  accountStatusFiveZeroZero,
} from '../../mocks/api/user/mhvAccountStatus';
import {
  mhvAccountStatusErrorsSorted,
  mhvAccountStatusUserError,
  showVerifyAndRegisterAlert,
} from '../../selectors';
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

  describe('AlertAccountApiAlert', () => {
    it('renders with userActionable=true when mhvAccountStatusSortedErrors.length > 0 and mhvAccountStatusUserErrors.length > 0', () => {
      // accountStatusMultiError has user action codes (801, 805) and non-user codes (802, 500)
      // sortedErrors.length > 0 and userErrors.length > 0
      // Need to ensure renderVerifyAndRegisterAlert is false (loa=3, serviceName not ID_ME/LOGIN_GOV)
      // and userRegistered is true (loa=3, vaPatient=true)
      const initialState = stateFn({
        loa: 3,
        vaPatient: true,
        serviceName: CSP_IDS.DS_LOGON, // Not ID_ME or LOGIN_GOV, so renderVerifyAndRegisterAlert is false
        accountStatusErrors: accountStatusMultiError,
      });

      // Verify selectors work with this state
      const sortedErrors = mhvAccountStatusErrorsSorted(initialState);
      const userErrors = mhvAccountStatusUserError(initialState);
      const shouldShowVerifyAlert = showVerifyAndRegisterAlert(initialState);
      expect(sortedErrors.length).to.be.greaterThan(0);
      expect(userErrors.length).to.be.greaterThan(0);
      expect(shouldShowVerifyAlert).to.be.false; // Should be false when loa=3

      const { getByTestId, getByText } = setup({ initialState });
      getByTestId('mhv-alert--mhv-registration');
      // When userActionable is true, it shows the actionable message
      getByText(/Error code \d+: Contact the My HealtheVet help desk/);
    });

    it('renders with userActionable=false when mhvAccountStatusSortedErrors.length > 0 and mhvAccountStatusUserErrors.length === 0', () => {
      // accountStatusFiveZeroZero only has error code 500, which is not a user action code
      // sortedErrors.length > 0 but userErrors.length === 0
      // Need to ensure renderVerifyAndRegisterAlert is false and userRegistered is true
      const initialState = stateFn({
        loa: 3,
        vaPatient: true,
        serviceName: CSP_IDS.DS_LOGON, // Not ID_ME or LOGIN_GOV, so renderVerifyAndRegisterAlert is false
        accountStatusErrors: accountStatusFiveZeroZero,
      });

      // Verify selectors work with this state
      const sortedErrors = mhvAccountStatusErrorsSorted(initialState);
      const userErrors = mhvAccountStatusUserError(initialState);
      const shouldShowVerifyAlert = showVerifyAndRegisterAlert(initialState);
      expect(sortedErrors.length).to.be.greaterThan(0);
      expect(userErrors.length).to.equal(0);
      expect(shouldShowVerifyAlert).to.be.false; // Should be false when loa=3

      const { getByTestId, getByText } = setup({ initialState });
      getByTestId('mhv-alert--mhv-registration');
      // When userActionable is false, it shows the non-actionable message
      getByText(
        /You can't access messages, medications, or medical records right now/,
      );
    });
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
