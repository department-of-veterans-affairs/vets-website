import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import set from 'platform/utilities/data/set';

import { PaymentInformation } from '../../containers/PaymentInformation';

describe('<PaymentInformation/>', () => {
  const defaultProps = {
    multifactorEnabled: true,
    isLoading: false,
    isEligible: true,
    fetchPaymentInformation() {},
    savePaymentInformation() {},
    editModalToggled() {},
    editModalFieldChanged() {},
    paymentInformationUiState: {
      isEditing: false,
      isSaving: false,
    },
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
    const fetchPaymentInformation = sinon.spy();
    const props = {
      ...defaultProps,
      fetchPaymentInformation,
      isEligible: false,
    };
    const wrapper = shallow(<PaymentInformation {...props} />);
    expect(wrapper.text()).to.be.empty;
    expect(fetchPaymentInformation.called).to.be.false;
    wrapper.unmount();
  });

  it('renders a prompt to enable 2FA is the user does not have it enabled already', () => {
    const props = { ...defaultProps, multifactorEnabled: false };
    const wrapper = shallow(<PaymentInformation {...props} />);
    expect(wrapper.find('PaymentInformation2FARequired')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders a load-fail message if the API returns an error during the initial fetch', () => {
    const props = set('paymentInformation', { error: {} }, defaultProps);
    const wrapper = shallow(<PaymentInformation {...props} />);
    expect(wrapper.find('LoadFail')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders a button for initializing direct deposit if the accountNumber is empty', () => {
    const props = set(
      'paymentInformation.responses[0].paymentAccount.accountNumber',
      '',
      defaultProps,
    );
    const wrapper = shallow(<PaymentInformation {...props} />);
    expect(wrapper.find('PaymentInformationAddLink')).to.have.lengthOf(1);
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
