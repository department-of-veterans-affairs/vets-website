import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaAlert,
  VaButton,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CONTENT = `We’ll send notifications about your VA health care and
  benefits to this email.`;
const VA_PROFILE_EMAIL_HREF =
  '/profile/contact-information#contact-email-address';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-44682&t=CogySEDQUAcvZwHQ-4
const AlertConfirmContactEmail = ({
  emailAddress,
  recordEvent,
  onConfirmClick,
  confirmError,
}) => {
  const headline = confirmError
    ? 'We couldn’t confirm your contact email'
    : 'Confirm your contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status={confirmError ? 'error' : 'warning'}
      role={confirmError ? 'alert' : 'status'}
      dataTestid="mhv-alert--confirm-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">
        <span className="usa-sr-only">warning</span>
        {headline}
      </h2>
      <React.Fragment key=".1">
        {confirmError && <p>Please try again.</p>}
        <p>{CONTENT}</p>
        <p
          className="vads-u-font-weight--bold"
          style={{ wordBreak: 'break-word' }}
        >
          {emailAddress}
        </p>
        <p>
          <VaButton onClick={() => onConfirmClick()} text="Confirm" />
        </p>
        <p>
          <VaLink
            href={VA_PROFILE_EMAIL_HREF}
            text="Go to profile to update your contact email"
          />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  confirmError: PropTypes.bool.isRequired,
  emailAddress: PropTypes.string.isRequired,
  recordEvent: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
};

export default AlertConfirmContactEmail;
