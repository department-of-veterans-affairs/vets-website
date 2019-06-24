import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const ACCOUNT_FLAGGED_FOR_FRAUD = 'cnp.payment.flashes.on.record.message';
const INVALID_ROUTING_NUMBER = 'payment.accountRoutingNumber.invalidCheckSum';

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
        If you have any questions, please call us at 800-827-1000 (TTY:
        800-829-4833), and select 5. We’re here Monday through Friday, 8:00 a.m.
        to 9:00 p.m. ET.
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

function hasError(errors, errorKey) {
  return errors.some(err =>
    err.meta.messages.some(message => message.key === errorKey),
  );
}

export default function PaymentInformationEditModalError({ responseError }) {
  const { errors = [] } = responseError.error;
  let content = <GenericError />;

  if (hasError(errors, ACCOUNT_FLAGGED_FOR_FRAUD)) {
    content = <FlaggedAccount />;
  } else if (hasError(errors, INVALID_ROUTING_NUMBER)) {
    content = <InvalidRoutingNumber />;
  }

  return (
    <AlertBox status="error" isVisible>
      {content}
    </AlertBox>
  );
}
