import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

// possible values for the `key` property on error messages we get from the server
const ACCOUNT_FLAGGED_FOR_FRAUD_KEY = 'cnp.payment.flashes.on.record.message';
const INVALID_ROUTING_NUMBER_KEY =
  'payment.accountRoutingNumber.invalidCheckSum';
const GENERIC_ERROR_KEY = 'cnp.payment.generic.error.message';

function FlaggedAccount() {
  return (
    <>
      <p>
        We’re sorry. You can’t change your direct deposit information right now
        because we’ve locked your account. We do this to protect your bank
        account information and prevent fraud when we think there may be a
        security issue.
      </p>
      <p>
        If you have any questions, please call us at{' '}
        <span className="no-wrap">800-827-1000</span> (TTY:
        <span className="no-wrap">800-829-4833</span>
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
      because your address is missing or invalid. Please go back to{' '}
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

function hasErrorMessageKey(errors, errorKey) {
  return errors.some(err =>
    err.meta.messages.some(message => message.key === errorKey),
  );
}

function hasErrorMessageText(errors, errorText) {
  return errors.some(err =>
    err.meta.messages.some(message =>
      message.text.toLowerCase().includes(errorText.toLowerCase()),
    ),
  );
}

function hasFlaggedForFraudError(errors) {
  return hasErrorMessageKey(errors, ACCOUNT_FLAGGED_FOR_FRAUD_KEY);
}

function hasInvalidRoutingNumberError(errors) {
  let result = false;
  if (hasErrorMessageKey(errors, INVALID_ROUTING_NUMBER_KEY)) {
    result = true;
  }
  if (
    hasErrorMessageKey(errors, GENERIC_ERROR_KEY) &&
    hasErrorMessageText(errors, 'Invalid Routing Number')
  ) {
    result = true;
  }
  return result;
}

function hasInvalidAddressError(errors) {
  let result = false;
  if (
    hasErrorMessageKey(errors, GENERIC_ERROR_KEY) &&
    hasErrorMessageText(errors, 'address update')
  ) {
    result = true;
  }
  return result;
}

function hasInvalidHomePhoneNumberError(errors) {
  let result = false;
  if (
    hasErrorMessageKey(errors, GENERIC_ERROR_KEY) &&
    (hasErrorMessageText(errors, 'night phone number') ||
      hasErrorMessageText(errors, 'night area number'))
  ) {
    result = true;
  }
  return result;
}

function hasInvalidWorkPhoneNumberError(errors) {
  let result = false;
  if (
    hasErrorMessageKey(errors, GENERIC_ERROR_KEY) &&
    (hasErrorMessageText(errors, 'day phone number') ||
      hasErrorMessageText(errors, 'day area number'))
  ) {
    result = true;
  }
  return result;
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
