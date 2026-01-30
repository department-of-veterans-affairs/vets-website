import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import DirectDepositViewField from '../../components/DirectDepositViewField';

describe('DirectDepositViewField component', () => {
  const initialState = {
    bankAccount: {
      accountType: 'checking',
      accountNumber: '123123123',
      routingNumber: '321321321',
    },
  };

  const formContext = {
    onError: () => {},
  };

  it('renders the DirectDepositViewField footer', () => {
    expect(<DirectDepositViewField />);
  });

  it('should render obfuscated checking account information', () => {
    const wrapper = mount(
      <DirectDepositViewField
        formData={initialState}
        formContext={formContext}
      />,
    );
    expect(wrapper.text()).to.include('Checking account');
    expect(wrapper.text()).to.include('●●●●●1321');
    expect(wrapper.text()).to.include('●●●●●3123');
    wrapper.unmount();
  });

  it('should render account information when no account type is provided', () => {
    initialState.bankAccount.accountType = '';

    const wrapper = mount(
      <DirectDepositViewField
        formData={initialState}
        formContext={formContext}
      />,
    );
    expect(wrapper.text()).to.include('Account');
    expect(wrapper.text()).to.include('●●●●●1321');
    expect(wrapper.text()).to.include('●●●●●3123');
    wrapper.unmount();
  });
});
