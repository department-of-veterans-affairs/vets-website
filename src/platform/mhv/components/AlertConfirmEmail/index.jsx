import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaButton,
  VaLink,
  VaLinkAction,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import {
  dismissAlertViaCookie,
  selectContactEmailAddress,
  showAlert,
} from './selectors';

const CONTENT = `We’ll send notifications about your VA health care and benefits to this email.`;
const VA_PROFILE_EMAIL_HREF =
  '/profile/contact-information#contact-email-address';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-44682&t=CogySEDQUAcvZwHQ-4
const AlertConfirmContactEmail = ({ email, onConfirmClick }) => {
  return (
    <VaAlert
      status="warning"
      dataTestid="alert-confirm-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">Confirm your contact email</h2>
      <React.Fragment key=".1">
        <p>{CONTENT}</p>
        <p className="vads-u-font-weight--bold">{email}</p>
        <p>
          <VaButton onClick={onConfirmClick} fullWidth text="Confirm" />
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
  email: PropTypes.string.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-45009&t=CogySEDQUAcvZwHQ-4
const AlertAddContactEmail = ({ onSkipClick }) => {
  return (
    <VaAlert
      status="warning"
      dataTestid="alert-add-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">Add a contact email</h2>
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
            fullWidth
            secondary
            onClick={onSkipClick}
            text="Skip adding email"
          />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertAddContactEmail.propTypes = {
  onSkipClick: PropTypes.func.isRequired,
};

/**
 * <AlertConfirmEmail /> component
 *
 * Shows an alert to confirm or add a contact email address
 *
 * To view specification, run:
 *   `yarn test:unit src/platform/mhv/tests/components/AlertConfirmEmail.unit.spec.jsx --reporter=spec`
 *
 * @returns {JSX.Element|null} <AlertConfirmContactEmail />, <AlertAddContactEmail />, or null
 */
const AlertConfirmEmail = () => {
  const renderAlert = useSelector(showAlert);
  const email = useSelector(selectContactEmailAddress);
  const [dismissed, setDismissed] = useState(false);

  const putConfirmationDate = (confirmationDate = new Date().toISOString) =>
    apiRequest('/profile/email_addresses', {
      method: 'PUT',
      body: { confirmationDate },
    })
      .then(() => setDismissed(true))
      .then(() => dismissAlertViaCookie());

  const onSkipClick = () => {
    setDismissed(true);
    dismissAlertViaCookie();
  };

  if (!renderAlert || dismissed) return null;

  return email ? (
    <AlertConfirmContactEmail
      email={email}
      onConfirmClick={putConfirmationDate}
    />
  ) : (
    <AlertAddContactEmail onSkipClick={onSkipClick} />
  );
};

export default AlertConfirmEmail;
