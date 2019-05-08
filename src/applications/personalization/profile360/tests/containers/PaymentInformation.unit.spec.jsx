import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { PaymentInformation } from '../../containers/PaymentInformation';

describe('<PaymentInformation/>', () => {
  const defaultProps = {
    isLoading: false,
    isEligible: true,
    fetchPaymentInformation() {},
    savePaymentInformation() {},
    paymentInformation: {
      responses: [
        {
          paymentAccount: {
            accountNumber: '123',
            accountType: 'Checking',
            financialInstitutionName: 'My bank',
            financialInstitutionRoutingNumber: '123456789',
          },
        },
      ],
    },
  };

  it('renders', () => {
    const wrapper = shallow(<PaymentInformation {...defaultProps} />);
    expect(wrapper.text()).to.not.be.empty;
    wrapper.unmount();
  });

  it('does not render if the user is not eligible for direct deposit', () => {
    const props = { ...defaultProps, isEligible: false };
    const wrapper = shallow(<PaymentInformation {...props} />);
    expect(wrapper.text()).to.be.empty;
    wrapper.unmount();
  });

  it('renders a loading indicator if isLoading is true', () => {
    const props = { ...defaultProps, isLoading: true };
    const wrapper = shallow(<PaymentInformation {...props} />);
    expect(wrapper.find('LoadingIndicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders the payment information', () => {
    const wrapper = shallow(<PaymentInformation {...defaultProps} />);
    const renderedText = wrapper.text();

    expect(renderedText).to.contain('123', 'Account number is rendered');
    expect(renderedText).to.contain('Checking', 'Account type is rendered');
    expect(renderedText).to.contain(
      'My bank',
      'Financial insitution name is rendered',
    );

    wrapper.unmount();
  });
});
