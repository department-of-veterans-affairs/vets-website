import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const AlertConfirmContactEmail = () => {
  const visible = Cookies.get('CONTACT_EMAIL_CONFIRMED') !== 'true';

  const [isVisible, setIsVisible] = useState(visible);

  const handleClose = () => {
    Cookies.set('CONTACT_EMAIL_CONFIRMED', 'true');
    setIsVisible(false);
  };

  return (
    <VaAlert
      className="vads-u-margin-top--1"
      closeable
      onCloseEvent={handleClose}
      status="warning"
      visible={isVisible}
    >
      <h2 slot="headline">Confirm your contact email address</h2>
      <React.Fragment key=".1">
        <p className="vads-u-margin-y--0">
          We’ll send all VA notifications to the contact email address listed in
          your VA.gov profile. We won’t send any more notifications to the email
          listed in the previous MyHealtheVet experience. Make sure the contact
          email address listed in your VA.gov profile is the one you want us to
          send notifications to.
        </p>
      </React.Fragment>
    </VaAlert>
  );
};
