import React from 'react';
import { expect } from 'chai';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { render } from '../unit-spec-helpers';

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
  render(<Alerts />, { initialState });

describe('<Alerts /> container', () => {
  it('renders nothing', () => {
    const { container } = setup();
    expect(container).to.be.empty;
  });

  it('renders <AlertMhvBasicAccount />', () => {
    const initialState = stateFn({ loa: 1, serviceName: CSP_IDS.MHV });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--mhv-basic-account');
    expect(getAllByTestId(/^mhv-alert--/).length).to.eq(1);
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

  it('renders <AlertMhvRegistration />', () => {
    const initialState = stateFn({ loa: 3, mhvAccountState: 'NONE' });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('mhv-alert--mhv-registration');
    expect(getAllByTestId(/^mhv-alert--/).length).to.eq(1);
  });
});
