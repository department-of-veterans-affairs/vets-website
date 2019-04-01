import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { PaymentReviewView } from '../../../0994/components/PaymentReviewView';

const data = {
  prefillBankAccount: {
    bankAccountType: 'Checking',
    bankAccountNumber: '*********1234',
    bankRoutingNumber: '*****2115',
    bankName: 'Comerica',
  },
};

describe('<PaymentReviewView>', () => {
  it('should render new bank info', () => {
    const component = shallow(
      <PaymentReviewView formData="savings" name="accountType" />,
    );

    const text = component.text();
    expect(text).to.contain('Savings');

    component.unmount();
  });
  it('should render prefill bank info', () => {
    const component = shallow(
      <PaymentReviewView name="accountType" data={data} />,
    );

    const text = component.text();
    expect(text).to.contain('Checking');

    component.unmount();
  });
  it('should not render prefill bank info', () => {
    const moreData = {
      ...data,
      'view:bankAccount': {
        bankAccount: {
          routingNumber: '021000021',
          accountNumber: '12',
        },
      },
    };
    const component = shallow(
      <PaymentReviewView name="accountType" data={moreData} />,
    );

    const text = component.text();
    expect(text).to.not.contain('Checking');

    component.unmount();
  });
});
