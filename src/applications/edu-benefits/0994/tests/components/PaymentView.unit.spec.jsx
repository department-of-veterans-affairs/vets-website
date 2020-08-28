import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { PaymentView } from '../../components/PaymentView';

const originalData = {
  bankAccountType: 'Checking',
  bankAccountNumber: '*********1234',
  bankRoutingNumber: '*****2115',
  bankName: 'Comerica',
};

const formData = {
  bankAccount: {
    accountType: 'Savings',
    accountNumber: '*********4321',
    routingNumber: '*****0000',
  },
};

describe('<PaymentView>', () => {
  it('should render prefill bank info', () => {
    const component = shallow(<PaymentView originalData={originalData} />);

    const text = component.text();
    expect(text).to.contain('Checking');
    expect(text).to.contain('●●●●●●●●●ending with1234');
    expect(text).to.contain('●●●●●ending with2115');

    component.unmount();
  });
  it('should render new bank info', () => {
    const component = shallow(
      <PaymentView formData={formData} originalData={originalData} />,
    );

    const text = component.text();
    expect(text).to.contain('Savings');
    expect(text).to.contain('●●●●●●●●●ending with4321');
    expect(text).to.contain('●●●●●ending with0000');

    component.unmount();
  });
});
