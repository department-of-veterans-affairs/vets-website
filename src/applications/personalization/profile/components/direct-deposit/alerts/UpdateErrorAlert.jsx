import React, { useEffect } from 'react';
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
      <p>
        You can also update this information by mail or in person at a VA
        regional office.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a href="/change-direct-deposit">
          Learn how to update your direct deposit bank information.
        </a>
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

function UpdatePhoneNumberError({ phoneNumberType }) {
  const editLink = `/profile/contact-information#edit-${phoneNumberType}-phone-number`;
  return (
    <p
      className="vads-u-margin-y--0"
      data-test-id={`update-${phoneNumberType}-phone-number-error`}
    >
      {`We’re sorry. We couldn’t update your direct deposit bank information
      because your ${phoneNumberType} phone number is missing or invalid. Please
      go back to`}{' '}
      <a href={editLink}>your profile</a>{' '}
      {`and fill in this required
      information.`}
    </p>
  );
}

function PaymentRestrictionError() {
  return (
    <>
      <p
        className="vads-u-margin-top--0"
        data-testid="payment-restriction-error"
      >
        We’re sorry. We couldn’t process your direct deposit update.
      </p>
      <p>
        <strong>What you can do now:</strong>
      </p>
      <p>
        Call us at{' '}
        <span className="no-wrap">
          <va-telephone contact="8008271000" />
        </span>{' '}
        (<va-telephone contact={CONTACTS['711']} tty />
        ). Tell the representative you received this message that we couldn’t
        process your direct deposit update. They’ll help you verify your account
        details and fix the problem. We’re here Monday through Friday, 8:00 a.m.
        to 9:00 p.m. ET.
      </p>
      <p>
        Or you can contact a regional office near you to come in for help in
        person.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a
          href="/find-locations/?page=&facilityType=benefits&serviceType"
          target="_blank"
        >
          Find a VA regional office near you (opens in a new tab)
        </a>
      </p>
    </>
  );
}

UpdatePhoneNumberError.propTypes = {
  phoneNumberType: PropTypes.oneOf(['home', 'work']),
};

export const UpdateErrorAlert = ({ className, saveError }) => {
  const alertRef = React.useRef();

  useEffect(
    () => {
      if (saveError) {
        alertRef?.current?.scrollIntoView?.();
        alertRef?.current?.setAttribute?.('tabindex', '-1');
        alertRef?.current?.focus?.();
      }
    },
    [saveError],
  );

  if (!saveError) {
    return null;
  }

  let content = <GenericError />;

  if (Array.isArray(saveError) && saveError?.length > 0) {
    if (
      hasAccountFlaggedError(saveError) ||
      hasPaymentRestrictionIndicatorsError(saveError)
    ) {
      content = <PaymentRestrictionError />;
    } else if (hasRoutingNumberFlaggedError(saveError)) {
      content = <FlaggedRoutingNumber />;
    } else if (hasInvalidRoutingNumberError(saveError)) {
      content = <InvalidRoutingNumber />;
    } else if (hasInvalidAddressError(saveError)) {
      content = <UpdateAddressError />;
    } else if (hasInvalidHomePhoneNumberError(saveError)) {
      content = <UpdatePhoneNumberError phoneNumberType="home" />;
    } else if (hasInvalidWorkPhoneNumberError(saveError)) {
      content = <UpdatePhoneNumberError phoneNumberType="work" />;
    }
  }

  return (
    <va-alert
      slim
      status="error"
      visible="true"
      class={className}
      ref={alertRef}
      uswds
    >
      {content}
    </va-alert>
  );
};

UpdateErrorAlert.propTypes = {
  className: PropTypes.string,
  saveError: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};
