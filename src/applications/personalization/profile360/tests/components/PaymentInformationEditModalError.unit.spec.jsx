import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PaymentInformationEditModalError from '../../components/PaymentInformationEditModalError';

describe('<PaymentInformationEditModalError />', () => {
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
              text:
                'Generic CnP payment update error. Update response: Update Failed: Day phone number is invalid, must be 7 digits',
            },
          ],
        },
      },
    ],
  };

  it('renders', () => {
    const wrapper = shallow(
      <PaymentInformationEditModalError
        responseError={{ error: genericError }}
      />,
    );
    expect(wrapper.html()).to.not.be.empty;
    wrapper.unmount();
  });

  it('renders the default error', () => {
    const wrapper = shallow(
      <PaymentInformationEditModalError
        responseError={{ error: genericError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. We couldn’t update your payment information. Please try again later.',
    );
    wrapper.unmount();
  });

  it('renders the invalid routing numaber error', () => {
    const wrapper = shallow(
      <PaymentInformationEditModalError
        responseError={{ error: checksumError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We couldn’t find a bank linked to this routing number. Please check your bank’s 9-digit routing number and enter it again.',
    );
    wrapper.unmount();
  });

  it('renders the flagged account error', () => {
    const wrapper = shallow(
      <PaymentInformationEditModalError
        responseError={{ error: accountFlaggedError }}
      />,
    );
    expect(wrapper.html()).to.contain(
      'We’re sorry. You can’t change your direct deposit information right now because we’ve locked your account. We do this to protect your bank account information and prevent fraud when we think there may be a security issue.',
    );
    wrapper.unmount();
  });
});
