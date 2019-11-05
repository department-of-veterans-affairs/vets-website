import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import set from 'platform/utilities/data/set';

import { PaymentInformation } from '../../containers/PaymentInformation';
import ProfileFieldHeading from 'vet360/components/base/ProfileFieldHeading';
import PaymentInformationEditModal from '../../components/PaymentInformationEditModal';
import DowntimeNotification from 'platform/monitoring/DowntimeNotification';

describe('<PaymentInformation/>', () => {
  const paymentAccount = {
    accountNumber: '123',
    accountType: 'Checking',
    financialInstitutionName: 'My bank',
    financialInstitutionRoutingNumber: '123456789',
  };
  const defaultProps = {
    directDepositIsSetUp: true,
    multifactorEnabled: true,
    isLoading: false,
    isEligible: true,
    fetchPaymentInformation() {},
    savePaymentInformation() {},
    editModalToggled() {},
    editModalFieldChanged() {},
    paymentAccount,
    paymentInformationUiState: {
      isEditing: false,
      isSaving: false,
    },
    paymentInformation: {
      responses: [
        {
          paymentAccount,
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

  it('renders nothing if the user has not already set up direct deposit', () => {
    const props = {
      ...defaultProps,
      directDepositIsSetUp: false,
    };
    const wrapper = shallow(<PaymentInformation {...props} />);

    expect(wrapper.text()).to.be.empty;

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

  it('renders a loading indicator if isLoading is true', () => {
    const props = { ...defaultProps, isLoading: true };
    const wrapper = shallow(<PaymentInformation {...props} />);
    expect(wrapper.find('LoadingIndicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders the payment information', () => {
    const wrapper = shallow(<PaymentInformation {...defaultProps} />);

    expect(wrapper.find(DowntimeNotification)).to.have.lengthOf(1);
    expect(wrapper.find(PaymentInformationEditModal)).to.have.lengthOf(1);
    const profileFieldHeadings = wrapper.find(ProfileFieldHeading);
    expect(profileFieldHeadings).to.have.lengthOf(3);
    profileFieldHeadings.forEach(node => {
      expect(typeof node.props().onEditClick).to.equal('function');
    });
    wrapper.find('.vet360-profile-field').forEach(node => {
      expect(node.text()).not.to.contain('Please add your');
    });
    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.contain('If you think you’ve been the victim of bank fraud');

    wrapper.unmount();
  });
});
