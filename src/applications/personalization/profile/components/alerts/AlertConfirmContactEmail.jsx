import React from 'react';
import Cookies from 'js-cookie';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const AlertConfirmContactEmail = () => (
  <VaAlert
    closeable
    onCloseEvent={() => Cookies.set('CONTACT_EMAIL_CONFIRMED', 'true')}
    status="warning"
    visible
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
