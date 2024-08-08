import React from 'react';
import { expect } from 'chai';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import Alerts from '../../containers/Alerts';

const stateFn = ({
  loa = 3,
  mhvAccountState = 'OK',
  serviceName = CSP_IDS.LOGIN_GOV,
  vaPatient = true,
} = {}) => ({
  user: {
    profile: {
      loa: { current: loa },
      mhvAccountState,
      signIn: { serviceName },
      vaPatient,
    },
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<Alerts />, { initialState });

describe('<Alerts /> container', () => {
  it('renders nothing', () => {
    const { container } = setup();
    expect(container).to.be.empty;
  });

  it('renders <AlertMhvBasicAccount />', () => {
    const initialState = stateFn({ loa: 1, serviceName: CSP_IDS.MHV });
    const { getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--mhv-basic-account');
  });

  it('renders <AlertVerifyAndRegister />', () => {
    const initialState = stateFn({ loa: 1, serviceName: CSP_IDS.ID_ME });
    const { getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--verify-and-register');
  });

  it('renders <AlertUnregistered />', () => {
    const initialState = stateFn({ vaPatient: false });
    const { getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--unregistered');
  });

  it('renders <AlertMhvRegistration />', () => {
    const initialState = stateFn({ loa: 3, mhvAccountState: 'NONE' });
    const { getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--mhv-registration');
  });
});
