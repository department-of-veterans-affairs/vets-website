import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import {
  hasFlaggedForFraudError,
  hasInvalidAddressError,
  hasInvalidHomePhoneNumberError,
  hasInvalidRoutingNumberError,
  hasInvalidWorkPhoneNumberError,
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
        (TTY: <span className="no-wrap">800-829-4833</span>
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
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
  closeModal,
}) {
  let content = <GenericError />;

  if (responseError.error) {
    const { errors = [] } = responseError.error;

    if (hasFlaggedForFraudError(errors)) {
      content = <FlaggedAccount />;
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
      headline="We couldn’t update your bank information"
      isVisible
    >
      {content}
    </AlertBox>
  );
}
