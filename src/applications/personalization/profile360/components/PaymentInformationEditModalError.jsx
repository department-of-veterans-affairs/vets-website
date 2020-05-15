import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import {
  hasAccountFlaggedError,
  hasRoutingNumberFlaggedError,
  hasInvalidAddressError,
  hasInvalidHomePhoneNumberError,
  hasInvalidRoutingNumberError,
  hasInvalidWorkPhoneNumberError,
  hasPaymentRestrictionIndicatorsError,
} from '../util';

function FlaggedAccount() {
  return (
    <>
      <p>
        We’re sorry. You can’t change your direct deposit information right now
        because we’ve locked the ability to edit this information. We do this to
        protect your bank account information and prevent fraud when we think
        there may be a security issue.
      </p>
      <p>
        To request that we unlock this function, please call us at{' '}
        <span className="no-wrap">
          <a href="tel:1-800-827-1000">800-827-1000</a>
        </span>{' '}
        (TTY: <span className="no-wrap">711</span>
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
}

function FlaggedRoutingNumber() {
  return (
    <>
      <p>
        We’re sorry. The bank routing number you entered requires additional
        verification before we can save your information. To use this bank
        routing number, you’ll need to call us at{' '}
        <span className="no-wrap">
          <a href="tel:1-800-827-1000">800-827-1000</a>
        </span>{' '}
        (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p>
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
    <p>
      We couldn’t find a bank linked to this routing number. Please check your
      bank’s 9-digit routing number and enter it again.
    </p>
  );
}

function GenericError() {
  return (
    <p>
      We’re sorry. We couldn’t update your payment information. Please try again
      later.
    </p>
  );
}

// Since we don't know what the error message looks like when there's a problem
// with the user's home address, we'll use a single error message for any and
// all address-related errors
function UpdateAddressError({ closeModal }) {
  return (
    <p>
      We’re sorry. We couldn’t update your direct deposit bank information
      because your mailing address is missing or invalid. Please go back to{' '}
      <a
        href="/profile/#contact-information"
        onClick={() => {
          closeModal();
        }}
      >
        your profile
      </a>{' '}
      and fill in this required information.
    </p>
  );
}

function UpdatePhoneNumberError({ closeModal, phoneNumberType = 'home' }) {
  return (
    <p>
      We’re sorry. We couldn’t update your direct deposit bank information
      because your {phoneNumberType} phone number is missing or invalid. Please
      go back to{' '}
      <a
        href="/profile/#contact-information"
        onClick={() => {
          closeModal();
        }}
      >
        your profile
      </a>{' '}
      and fill in this required information.
    </p>
  );
}

export default function PaymentInformationEditModalError({
  responseError,
  className,
  closeModal = () => {},
}) {
  let content = <GenericError error={responseError} />;
  let headline = 'We couldn’t update your bank information';

  if (responseError.error) {
    const { errors = [] } = responseError.error;

    if (
      hasAccountFlaggedError(errors) ||
      hasPaymentRestrictionIndicatorsError(errors)
    ) {
      content = <FlaggedAccount />;
    } else if (hasRoutingNumberFlaggedError(errors)) {
      content = <FlaggedRoutingNumber />;
      headline = 'We can’t save your bank routing number';
    } else if (hasInvalidRoutingNumberError(errors)) {
      content = <InvalidRoutingNumber />;
    } else if (hasInvalidAddressError(errors)) {
      content = <UpdateAddressError closeModal={closeModal} />;
    } else if (hasInvalidHomePhoneNumberError(errors)) {
      content = (
        <UpdatePhoneNumberError
          closeModal={closeModal}
          phoneNumberType="home"
        />
      );
    } else if (hasInvalidWorkPhoneNumberError(errors)) {
      content = (
        <UpdatePhoneNumberError
          closeModal={closeModal}
          phoneNumberType="work"
        />
      );
    }
  }

  return (
    <AlertBox
      status="error"
      headline={headline}
      isVisible
      className={className}
    >
      {content}
    </AlertBox>
  );
}
