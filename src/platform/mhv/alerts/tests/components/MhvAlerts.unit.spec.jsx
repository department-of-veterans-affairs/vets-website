import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import MhvAlerts from '../../components/MhvAlerts';

const stateFn = ({
  loa = 3,
  loading = false,
  mhvAccountState = 'OK',
  serviceName = CSP_IDS.LOGIN_GOV,
  vaPatient = true,
} = {}) => ({
  user: {
    profile: {
      loading,
      loa: { current: loa },
      mhvAccountState,
      signIn: { serviceName },
      vaPatient,
    },
  },
});

const setup = ({ initialState = stateFn(), jsx = <MhvAlerts /> } = {}) =>
  renderInReduxProvider(jsx, { initialState });

describe('<MhvAlerts /> container', () => {
  it('renders nothing', () => {
    const { container } = setup();
    expect(container).to.be.empty;
  });

  it('renders <Loading />', async () => {
    const initialState = stateFn({ loading: true });
    const { getByTestId } = setup({ initialState });
    await waitFor(() => {
      getByTestId('mhv-alert--loading');
    });
  });

  it('renders children', () => {
    const content = <div data-testid="app--content" />;
    const jsx = <MhvAlerts>{content}</MhvAlerts>;
    const { findAllByTestId, getByTestId } = setup({ jsx });
    getByTestId('app--content');
    expect(findAllByTestId(/^mhv-alert--/)).to.be.empty;
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
