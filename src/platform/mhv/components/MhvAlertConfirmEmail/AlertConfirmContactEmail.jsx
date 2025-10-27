import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaAlert,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ConfirmEmailButton from '../../../user/profile/vap-svc/components/ConfirmEmailButton';

const CONTENT = `We’ll send notifications about your VA health care and
  benefits to this email.`;
const VA_PROFILE_EMAIL_HREF =
  '/profile/contact-information#contact-email-address';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-44682&t=CogySEDQUAcvZwHQ-4
const AlertConfirmContactEmail = ({
  emailAddress,
  recordEvent,
  onConfirmSuccess,
  onConfirmError,
  apiAction,
}) => {
  const headline = 'Confirm your contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status="warning"
      dataTestid="mhv-alert--confirm-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">{headline}</h2>
      <React.Fragment key=".1">
        <p>{CONTENT}</p>
        <p
          className="vads-u-font-weight--bold"
          style={{ wordBreak: 'break-word' }}
        >
          {emailAddress}
        </p>
        <p>
          <ConfirmEmailButton
            apiAction={apiAction}
            onSuccess={() => onConfirmSuccess && onConfirmSuccess()}
            onError={err => onConfirmError && onConfirmError(err)}
          >
            Confirm
          </ConfirmEmailButton>
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
  emailAddress: PropTypes.string.isRequired,
  recordEvent: PropTypes.func.isRequired,
  apiAction: PropTypes.func,
  onConfirmError: PropTypes.func,
  onConfirmSuccess: PropTypes.func,
};

export default AlertConfirmContactEmail;
