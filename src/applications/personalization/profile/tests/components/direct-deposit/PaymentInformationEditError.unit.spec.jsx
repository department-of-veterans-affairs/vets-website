import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PaymentInformationEditError from '@@profile/components/direct-deposit/PaymentInformationEditError';

describe('<PaymentInformationEditError />', () => {
  const checksumError = {
    errors: [
      {
        title: 'Internal server error',
        detail: 'Internal server error',
        code: '500',
        source: 'EVSS::PPIU::Service',
        status: '500',
        meta: {
          messages: [
            {
              key: 'payment.accountRoutingNumber.invalidCheckSum',
              severity: 'ERROR',
              text: 'Account Routing Number contains invalid checksum',
            },
          ],
        },
      },
    ],
  };
  const restrictionIndicatorsPresentError = {
    errors: [
      {
        code: '126',
        detail: 'One or more unprocessable user payment properties',
        meta: {
          messages: [
            {
              key: 'payment.restriction.indicators.present',
              severity: 'ERROR',
              text: 'Cannot perform an update due to restriction indicators',
            },
          ],
        },
        source: 'EVSS::PPIU::Service',
        status: '422',
        title: 'Unprocessable Entity',
      },
    ],
  };
  const invalidRoutingNumberError = {
    errors: [
      {
        code: '126',
        detail: 'One or more unprocessable user payment properties',
        meta: {
          messages: [
            {
              key: 'cnp.payment.generic.error.message',
              severity: 'ERROR',
              text:
                'Generic CnP payment update error. Update response: Update Failed: Invalid Routing Number',
            },
          ],
        },
        source: 'EVSS::PPIU::Service',
        status: '422',
        title: 'Unprocessable Entity',
      },
    ],
  };
  const accountFlaggedError = {
    errors: [
      {
        title: 'Account Flagged',
        detail: 'The account has been flagged',
        code: '136',
        source: 'EVSS::PPIU::Service',
        status: '422',
        meta: {
          messages: [
            {
              key: 'cnp.payment.flashes.on.record.message',
              severity: 'ERROR',
              text: 'Flashes on record',
            },
          ],
        },
      },
    ],
  };
  const routingNumberFlaggedError = {
    errors: [
      {
        title: 'Potential Fraud',
        detail: 'Routing number related to potential fraud',
        code: '135',
        source: 'EVSS::PPIU::Service',
        status: '422',
        meta: {
          messages: [
            {
              key: 'cnp.payment.routing.number.fraud.message',
              severity: 'ERROR',
              text: 'Routing number related to potential fraud',
            },
          ],
        },
      },
    ],
  };
  const badWorkPhoneNumberError = {
    errors: [
      {
        title: 'Unprocessable Entity',
        detail: 'One or more unprocessable user payment properties',
        code: '126',
        source: 'EVSS::PPIU::Service',
        status: '422',
        meta: {
          messages: [
            {
              key: 'cnp.payment.generic.error.message',
              severity: 'ERROR',
              text:
                'Generic CnP payment update error. Update response: Update Failed: Day phone number is invalid, must be 7 digits',
            },
          ],
        },
      },
    ],
  };
  const badHomeAreaCodeError = {
    errors: [
      {
        title: 'Unprocessable Entity',
        detail: 'One or more unprocessable user payment properties',
        code: '126',
        source: 'EVSS::PPIU::Service',
        status: '422',
        meta: {
          messages: [
            {
              key: 'cnp.payment.generic.error.message',
              severity: 'ERROR',
              text:
                'Generic CnP payment update error. Update response: Update Failed: Night area number is invalid, must be 3 digits',
            },
          ],
        },
      },
    ],
  };
  const badAddressError = {
    errors: [
      {
        title: 'Unprocessable Entity',
        detail: 'One or more unprocessable user payment properties',
        code: '126',
        source: 'EVSS::PPIU::Service',
        status: '422',
        meta: {
          messages: [
            {
              key: 'cnp.payment.generic.error.message',
              severity: 'ERROR',
              text:
                'Generic CnP payment update error. Update response: Update Failed: Required field not entered for mailing address update',
            },
          ],
        },
      },
    ],
  };
  const genericError = {
    errors: [
      {
        title: 'Unprocessable Entity',
        detail: 'One or more unprocessable user payment properties',
        code: '126',
        source: 'EVSS::PPIU::Service',
        status: '422',
        meta: {
          messages: [
            {
              key: 'cnp.payment.generic.error.message',
              severity: 'ERROR',
              text: 'This is a generic error that we do not recognize.',
            },
          ],
        },
      },
    ],
  };

  // When VA Profile was not working in the staging env, we saw this error when
  // saving direct deposit info (hitting PUT ppiu/payment_information)
  const upstreamError = {
    errors: [
      {
        title: 'Bad Gateway',
        detail: 'Received an an invalid response from the upstream server',
        code: 'VET360_502',
        source: 'Vet360::ContactInformation::Service',
        status: '502',
      },
    ],
  };

  it('renders', () => {
    const wrapper = shallow(
      <PaymentInformationEditError responseError={{ error: genericError }} />,
    );
    expect(wrapper.html()).to.not.be.empty;
    wrapper.unmount();
  });

  it('renders the default error when it gets an unrecognized error message', () => {
    const wrapper = shallow(
      <PaymentInformationEditError responseError={{ error: genericError }} />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your payment information. Please try again later.',
    );
    wrapper.unmount();
  });

  it('renders the invalid routing number error', () => {
    let wrapper = shallow(
      <PaymentInformationEditError responseError={{ error: checksumError }} />,
    );
    expect(wrapper.html()).to.contain(
      'We couldn’t find a bank linked to this routing number. Please check your bank’s 9-digit routing number and enter it again.',
    );
    wrapper.unmount();

    wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: invalidRoutingNumberError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We couldn’t find a bank linked to this routing number. Please check your bank’s 9-digit routing number and enter it again.',
    );
    wrapper.unmount();
  });

  it('renders the flagged/locked account error', () => {
    let wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: accountFlaggedError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. You can’t change your direct deposit information right now because we’ve locked the ability to edit this information. We do this to protect your bank account information and prevent fraud when we think there may be a security issue.',
    );
    wrapper.unmount();

    wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: restrictionIndicatorsPresentError }}
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
        responseError={{ error: routingNumberFlaggedError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. The bank routing number you entered requires additional verification before we can save your information. To use this bank routing number, you’ll need to call us at <span class="no-wrap"><a href="tel:1-800-827-1000">800-827-1000</a></span> (TTY: <a class="no-wrap " href="tel:711" aria-label="7 1 1.">711</a>). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
    );
    wrapper.unmount();
  });

  it('renders an error message prompting the user to update their address', () => {
    const wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: badAddressError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your direct deposit bank information because your mailing address is missing or invalid. Please go back to <a href="/profile/personal-information">your profile</a> and fill in this required information.',
    );
    wrapper.unmount();
  });

  it('renders the bad phone number error messages', () => {
    let wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: badWorkPhoneNumberError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your direct deposit bank information because your work phone number is missing or invalid. Please go back to <a href="/profile/personal-information">your profile</a> and fill in this required information.',
    );
    wrapper.unmount();

    wrapper = shallow(
      <PaymentInformationEditError
        responseError={{ error: badHomeAreaCodeError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your direct deposit bank information because your home phone number is missing or invalid. Please go back to <a href="/profile/personal-information">your profile</a> and fill in this required information.',
    );
    wrapper.unmount();
  });

  it('renders the default error when an upstream error occurs', () => {
    const wrapper = shallow(
      <PaymentInformationEditError responseError={upstreamError} />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your payment information. Please try again later.',
    );
    wrapper.unmount();
  });
});
