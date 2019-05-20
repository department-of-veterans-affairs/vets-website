import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const ACCOUNT_FLAGGED_FOR_ACTIVE_FRAUD_INVESTIGATION = 'Account Flagged';

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

export default function PaymentInformationEditModalError({ responseError }) {
  if (!responseError) return null;

  const { errors = [] } = responseError.error;
  let content = null;

  const flaggedAccount = errors.some(
    err => err.title === ACCOUNT_FLAGGED_FOR_ACTIVE_FRAUD_INVESTIGATION,
  );

  if (flaggedAccount) {
    content = <FlaggedAccount />;
  } else {
    content = (
      <p>
        We’re sorry. We couldn’t update your payment information. Please try
        again later.
      </p>
    );
  }

  return (
    <AlertBox status="error" isVisible>
      {content}
    </AlertBox>
  );
}
