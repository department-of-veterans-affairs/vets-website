import React from 'react';
import { useSelector } from 'react-redux';

import { VaCriticalAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { showConfirmEmail } from '../selectors';

const ConfirmEmailLink = () => {
  const renderConfirmEmailLink = useSelector(showConfirmEmail)();

  if (!renderConfirmEmailLink) {
    return null;
  }

  return (
    <VaCriticalAction
      link="/profile/contact-information#contact-email-address"
      text="Confirm your contact email address to keep getting VA notifications"
      data-testid="va-profile--confirm-contact-email-link"
    />
  );
};

export default ConfirmEmailLink;
