import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PaymentView from '../../components/PaymentView';

describe.skip('Disability benefits 526EZ payment view', () => {
  const defaultProps = {
    accountType: 'Checking',
    accountNumber: '123456789',
    financialInstitutionRoutingNumber: '234567890',
    financialInstitutionName: 'Comerica',
  };

  it('should render payment info when available', () => {
    const wrapper = shallow(<PaymentView />);
    expect(wrapper.type()).to.equal('div');
    wrapper.unmount();
  });

  it('should render payment info when provided', () => {
    const wrapper = shallow(<PaymentView {...defaultProps} />);
    expect(wrapper.render().text()).to.contain(
      // Looks a little different in the UI, but this is how its read by the screen reader
      'Account number: ●●●●●ending with6789',
    );
    wrapper.unmount();
  });

  it('should render help when no payment info provided', () => {
    const wrapper = shallow(<PaymentView />);
    expect(wrapper.render().text()).to.contain(
      'You can update your payment information a few ways:',
    );
    wrapper.unmount();
  });
});
