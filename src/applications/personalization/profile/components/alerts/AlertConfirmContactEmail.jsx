import React from 'react';
import { useSelector } from 'react-redux';
import { selectVAPEmailUpdatedAt } from '@department-of-veterans-affairs/platform-user/selectors';
import { showConfirmEmail } from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const AlertConfirmContactEmail = () => {
  const isVisible = useSelector(showConfirmEmail)();
  const emailUpdatedAt = useSelector(selectVAPEmailUpdatedAt);
  const h2Content = emailUpdatedAt
    ? 'Confirm your contact email'
    : 'Add a contact email';

  return (
    <VaAlert
      className="vads-u-margin-top--1"
      status="warning"
      visible={isVisible}
      data-testid="va-profile--alert-confirm-contact-email"
    >
      <h2 slot="headline">{h2Content}</h2>
      <React.Fragment key=".1">
        <p className="vads-u-margin-y--0">
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
      </React.Fragment>
    </VaAlert>
  );
};
