import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';

import PaymentInformationEditError from '@@profile/components/direct-deposit/PaymentInformationEditError';

const { errors } = mockDisabilityCompensations.updates;

describe('<PaymentInformationEditError />', () => {
  it('renders', () => {
    const wrapper = shallow(
      <PaymentInformationEditError
        responseError={{
          error: errors.generic,
        }}
      />,
    );
    expect(wrapper.html()).to.not.be.empty;
    wrapper.unmount();
  });

  it('renders the default error when it gets an unrecognized error message', () => {
    const wrapper = shallow(
      <PaymentInformationEditError
        responseError={{
          error: errors.generic,
        }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your payment information. Please try again later.',
    );
    wrapper.unmount();
  });

  it('renders the invalid routing number error', () => {
    let wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: errors.invalidChecksumRoutingNumber }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We can’t find a bank linked to the routing number you entered.',
    );
    wrapper.unmount();

    wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: errors.invalidRoutingNumber }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We can’t find a bank linked to the routing number you entered.',
    );
    wrapper.unmount();
  });

  it('renders the flagged/locked account error', () => {
    const wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: errors.paymentRestrictionsPresent }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. You can’t change your direct deposit information right now because we’ve locked the ability to edit this information. We do this to protect your bank account information and prevent fraud when we think there may be a security issue.',
    );
    wrapper.unmount();
  });

  it('renders the flagged routing number error', () => {
    const wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: errors.routingNumberFlagged }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. The bank routing number you entered requires additional verification before we can save your information. To use this bank routing number, you’ll need to call us at <span class="no-wrap"><va-telephone contact="8008271000"></va-telephone></span> (<va-telephone contact="711" tty="true"></va-telephone>). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
    );
    wrapper.unmount();
  });

  it('renders an error message prompting the user to update their address', () => {
    const wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: errors.invalidMailingAddress }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your direct deposit bank information because your mailing address is missing or invalid. Please go back to <a href="/profile/contact-information#edit-mailing-address">your profile</a> and fill in this required information.',
    );
    wrapper.unmount();
  });

  it('renders the bad phone number error messages', () => {
    let wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: errors.invalidDayPhone }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your direct deposit bank information because your work phone number is missing or invalid. Please go back to <a href="/profile/contact-information#edit-work-phone-number">your profile</a> and fill in this required information.',
    );
    wrapper.unmount();

    wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: errors.invalidNightPhone }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your direct deposit bank information because your home phone number is missing or invalid. Please go back to <a href="/profile/contact-information#edit-home-phone-number">your profile</a> and fill in this required information.',
    );
    wrapper.unmount();
  });

  it('renders the default error when an upstream error occurs', () => {
    const wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: errors.unspecified }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your payment information. Please try again later.',
    );
    wrapper.unmount();
  });
});
