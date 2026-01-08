import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaAlert,
  VaButton,
  VaLinkAction,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CONTENT = `We’ll send notifications about your VA health care and
  benefits to this email.`;
const VA_PROFILE_EMAIL_HREF = '/profile/contact-information#email-address';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-45009&t=CogySEDQUAcvZwHQ-4
const AlertAddContactEmail = ({ recordEvent, onSkipClick }) => {
  const headline = 'Add a contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status="warning"
      role="status"
      dataTestid="mhv-alert--add-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">
        <span className="usa-sr-only">warning</span>
        {headline}
      </h2>
      <React.Fragment key=".1">
        <p>{CONTENT}</p>
        <p>
          <VaLinkAction
            type="primary-entry"
            href={VA_PROFILE_EMAIL_HREF}
            text="Go to profile to add a contact email"
          />
        </p>
        <p>
          <VaButton
            secondary
            onClick={() => onSkipClick()}
            text="Skip adding email"
          />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertAddContactEmail.propTypes = {
  recordEvent: PropTypes.func.isRequired,
  onSkipClick: PropTypes.func.isRequired,
};

export default AlertAddContactEmail;
