import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { toggleDirectDepositEdit } from '@@profile/actions/directDeposit';
import { AccountInfoView } from '@@profile/components/direct-deposit/AccountInfoView';

describe('<AccountInfoView />', () => {
  const mockStore = configureMockStore();
  let store;

  const paymentAccount = {
    name: 'Test Bank',
    accountNumber: '1234',
    accountType: 'Checking',
  };

  beforeEach(() => {
    store = mockStore({});
  });

  it('renders the account information correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <AccountInfoView paymentAccount={paymentAccount} showUpdateSuccess />
      </Provider>,
    );

    expect(getByText('Test Bank')).to.exist;
    expect(getByText('1234')).to.exist;
    expect(getByText('Checking account')).to.exist;
  });

  it('renders the UpdateSuccessAlert when showUpdateSuccess is true', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <AccountInfoView paymentAccount={paymentAccount} showUpdateSuccess />
      </Provider>,
    );

    expect(getByTestId('bankInfoUpdateSuccessAlert')).to.exist;
  });

  it('does not render the UpdateSuccessAlert when showUpdateSuccess is false', () => {
    const { queryByTestId } = render(
      <Provider store={store}>
        <AccountInfoView
          paymentAccount={paymentAccount}
          showUpdateSuccess={false}
        />
      </Provider>,
    );

    expect(queryByTestId('bankInfoUpdateSuccessAlert')).to.not.exist;
  });

  it('dispatches the toggleDirectDepositEdit action when the Edit button is clicked', () => {
    const { getByText } = render(
      <Provider store={store}>
        <AccountInfoView paymentAccount={paymentAccount} showUpdateSuccess />
      </Provider>,
    );

    fireEvent.click(getByText('Edit'));
    const actions = store.getActions();
    expect(actions).to.deep.equal([toggleDirectDepositEdit()]);
  });

  it('renders the NoAccountInfo component when paymentAccount is not provided', () => {
    const { getByText } = render(
      <Provider store={store}>
        <AccountInfoView showUpdateSuccess />
      </Provider>,
    );

    expect(getByText('Edit your profile to add your bank information.')).to
      .exist;
    expect(getByText('Edit')).to.exist;
  });

  it('calls recordEvent when the Edit button is clicked and payment account is present', () => {
    const recordEventSpy = sinon.spy();

    const { getByText } = render(
      <Provider store={store}>
        <AccountInfoView
          paymentAccount={paymentAccount}
          showUpdateSuccess
          recordEventImpl={recordEventSpy}
        />
      </Provider>,
    );

    fireEvent.click(getByText('Edit'));
    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.args[0][0]).to.deep.equal({
      event: 'profile-navigation',
      'profile-action': 'edit-link',
      'profile-section': 'direct-deposit-information',
    });
  });

  it('calls recordEvent when the Edit button is clicked and payment account is NOT present', () => {
    const recordEventSpy = sinon.spy();

    const { getByText } = render(
      <Provider store={store}>
        <AccountInfoView showUpdateSuccess recordEventImpl={recordEventSpy} />
      </Provider>,
    );

    fireEvent.click(getByText('Edit'));
    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.args[0][0]).to.deep.equal({
      event: 'profile-navigation',
      'profile-action': 'add-link',
      'profile-section': 'direct-deposit-information',
    });
  });
});
