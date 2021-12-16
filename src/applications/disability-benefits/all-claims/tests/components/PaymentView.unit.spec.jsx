import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { PaymentView } from '../../components/PaymentView';

describe('AllClaims PaymentView', () => {
  it('should render with no data', () => {
    const tree = shallow(<PaymentView />);
    expect(tree.find('.blue-bar-block').length).to.equal(1);
    tree.unmount();
  });

  it('should render with formData and no originalData', () => {
    const formData = {
      bankAccountType: 'Checking',
      bankAccountNumber: '1231231234',
      bankRoutingNumber: '123123123',
      bankName: 'Big Bank',
    };
    const tree = shallow(<PaymentView formData={formData} />);
    const text = tree.text();
    expect(text).to.contain('Checking Account');
    expect(text).to.contain('Account number: ●●●●●●ending with1234');
    expect(text).to.contain('Bank routing number: ●●●●●ending with3123');
    expect(text).to.contain('Bank name: Big Bank');
    expect(tree.find('va-alert').length).to.equal(1);
    tree.unmount();
  });

  it('should render with originalData only', () => {
    const originalData = {
      'view:bankAccountType': 'Checking',
      'view:bankAccountNumber': '1231231234',
      'view:bankRoutingNumber': '123123123',
      'view:bankName': 'Big Bank',
    };
    const tree = shallow(<PaymentView originalData={originalData} />);
    const text = tree.text();
    expect(text).to.contain(
      'We’re currently paying your compensation to this account',
    );
    expect(text).to.contain('Checking Account');
    expect(text).to.contain('Account number: ●●●●●●ending with1234');
    expect(text).to.contain('Bank routing number: ●●●●●ending with3123');
    expect(text).to.contain('Bank name: Big Bank');
    tree.unmount();
  });

  it('should render with different formData than originalData', () => {
    const formData = {
      bankAccountType: 'Checking',
      bankAccountNumber: '1231231234',
      bankRoutingNumber: '123123123',
      bankName: 'Big Bank',
    };
    const originalData = {
      'view:bankAccountType': 'Checking',
      'view:bankAccountNumber': '83920405839',
      'view:bankRoutingNumber': '987654321',
      'view:bankName': 'Old Bank',
    };
    const tree = shallow(
      <PaymentView formData={formData} originalData={originalData} />,
    );
    const text = tree.text();
    expect(text).to.contain('Checking Account');
    expect(text).to.contain('Account number: ●●●●●●ending with1234');
    expect(text).to.contain('Bank routing number: ●●●●●ending with3123');
    expect(text).to.contain('Bank name: Big Bank');
    expect(tree.find('va-alert').length).to.equal(1);
    tree.unmount();
  });
});
