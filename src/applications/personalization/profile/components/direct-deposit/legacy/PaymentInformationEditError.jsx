import React from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import {
  hasAccountFlaggedError,
  hasRoutingNumberFlaggedError,
  hasInvalidAddressError,
  hasInvalidHomePhoneNumberError,
  hasInvalidRoutingNumberError,
  hasInvalidWorkPhoneNumberError,
  hasPaymentRestrictionIndicatorsError,
} from '@@profile/util';

function FlaggedAccount() {
  return (
    <>
      <p className="vads-u-margin-top--0" data-testid="flagged-account-error">
        We’re sorry. You can’t change your direct deposit information right now
        because we’ve locked the ability to edit this information. We do this to
        protect your bank account information and prevent fraud when we think
        there may be a security issue.
      </p>
      <p className="vads-u-margin-bottom--0">
        To request that we unlock this function, please call us at{' '}
        <span className="no-wrap">
          <va-telephone contact="8008271000" />
        </span>{' '}
        (<va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
}

function FlaggedRoutingNumber() {
  return (
    <>
      <p
        className="vads-u-margin-top--0"
        data-testid="flagged-routing-number-error"
      >
        We’re sorry. The bank routing number you entered requires additional
        verification before we can save your information. To use this bank
        routing number, you’ll need to call us at{' '}
        <span className="no-wrap">
          <va-telephone contact="8008271000" />
        </span>{' '}
        (<va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p className="vads-u-margin-bottom--0">
        You can also update this information by mail or in person at a VA
        regional office.{' '}
        <a href="/change-direct-deposit">
          Learn how to update your direct deposit bank information
        </a>
        .
      </p>
    </>
  );
}

function InvalidRoutingNumber() {
  return (
    <>
      <p
        className="vads-u-margin-top--0"
        data-testid="invalid-routing-number-error"
      >
        We can’t find a bank linked to the routing number you entered.
      </p>
      <p className="vads-u-margin-bottom--0">
        Review your routing number and make sure it’s correct.
      </p>
    </>
  );
}

function GenericError() {
  return (
    <p className="vads-u-margin-y--0" data-testid="generic-error">
      We’re sorry. We couldn’t update your payment information. Please try again
      later.
    </p>
  );
}

// Since we don't know what the error message looks like when there's a problem
// with the user's home address, we'll use a single error message for any and
// all address-related errors
function UpdateAddressError() {
  return (
    <p className="vads-u-margin-y--0" data-testid="update-address-error">
      We’re sorry. We couldn’t update your direct deposit bank information
      because your mailing address is missing or invalid. Please go back to{' '}
      <a href="/profile/contact-information#edit-mailing-address">
        your profile
      </a>{' '}
      and fill in this required information.
    </p>
  );
}

function UpdatePhoneNumberError({ phoneNumberType = 'home' }) {
  const editLink = `/profile/contact-information#edit-${phoneNumberType}-phone-number`;
  return (
    <p
      className="vads-u-margin-y--0"
      data-test-id={`update-${phoneNumberType}-phone-number-error`}
    >
      We’re sorry. We couldn’t update your direct deposit bank information
      because your {phoneNumberType} phone number is missing or invalid. Please
      go back to <a href={editLink}>your profile</a> and fill in this required
      information.
    </p>
  );
}

UpdatePhoneNumberError.propTypes = {
  phoneNumberType: PropTypes.oneOf(['home', 'work']),
};

export default function PaymentInformationEditError({
  className,
  responseError,
}) {
  let content = <GenericError error={responseError} />;

  if (responseError.error) {
    const { errors = [] } = responseError.error;

    if (
      hasAccountFlaggedError(errors) ||
      hasPaymentRestrictionIndicatorsError(errors)
    ) {
      content = <FlaggedAccount />;
    } else if (hasRoutingNumberFlaggedError(errors)) {
      content = <FlaggedRoutingNumber />;
    } else if (hasInvalidRoutingNumberError(errors)) {
      content = <InvalidRoutingNumber />;
    } else if (hasInvalidAddressError(errors)) {
      content = <UpdateAddressError />;
    } else if (hasInvalidHomePhoneNumberError(errors)) {
      content = <UpdatePhoneNumberError phoneNumberType="home" />;
    } else if (hasInvalidWorkPhoneNumberError(errors)) {
      content = <UpdatePhoneNumberError phoneNumberType="work" />;
    }
  }

  return (
    <va-alert
      background-only
      status="error"
      visible="true"
      class={className}
      uswds
    >
      {content}
    </va-alert>
  );
}

PaymentInformationEditError.propTypes = {
  className: PropTypes.string,
  responseError: PropTypes.shape({
    error: PropTypes.shape({
      errors: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};
