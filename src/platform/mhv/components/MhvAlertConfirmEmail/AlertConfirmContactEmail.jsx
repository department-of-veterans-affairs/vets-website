import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import AlertConfirmContactEmailContent from './AlertConfirmContactEmailContent';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-44682&t=CogySEDQUAcvZwHQ-4
const AlertConfirmContactEmail = ({
  emailAddress,
  isConfirming = false,
  onConfirmClick,
  recordEvent,
}) => {
  const headline = 'Confirm your contact email';
  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status="warning"
      role="status"
      dataTestid="mhv-alert--confirm-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">
        <span className="usa-sr-only">warning</span>
        {headline}
      </h2>
      <AlertConfirmContactEmailContent
        emailAddress={emailAddress}
        isConfirming={isConfirming}
        onConfirmClick={() => onConfirmClick()}
      />
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  recordEvent: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool,
};

export default AlertConfirmContactEmail;
