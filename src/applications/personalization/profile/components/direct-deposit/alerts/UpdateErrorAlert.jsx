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
      <p className="vads-u-margin-bottom--0">
        Or you can contact a regional office near you to come in for help in
        person.
        <br />
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
  let title = 'We couldn’t update your bank information';

  if (Array.isArray(saveError) && saveError?.length > 0) {
    if (hasAccountFlaggedError(saveError)) {
      content = <FlaggedAccount />;
    } else if (hasPaymentRestrictionIndicatorsError(saveError)) {
      title = "We couldn't update your direct deposit information";
      content = <PaymentRestrictionError />;
    } else if (hasRoutingNumberFlaggedError(saveError)) {
      content = <FlaggedRoutingNumber />;
    } else if (hasInvalidRoutingNumberError(saveError)) {
      title = '';
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
      slim={!title}
      status="error"
      visible="true"
      class={className}
      ref={alertRef}
      uswds
    >
      {title && <h2 slot="headline">{title}</h2>}
      {content}
    </va-alert>
  );
};

UpdateErrorAlert.propTypes = {
  className: PropTypes.string,
  saveError: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};
