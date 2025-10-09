import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaButton,
  VaLink,
  VaLinkAction,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { datadogRum } from '@datadog/browser-rum';
import {
  dismissAlertViaCookie,
  selectContactEmailAddress,
  showAlert,
} from './selectors';

const _recordLoadEvent = headline => {
  // record GA event
  recordEvent({
    event: 'nav-alert-box-load',
    action: 'load',
    'alert-box-headline': headline,
    'alert-box-status': 'warning',
  });
  // record DD event
  datadogRum.addAction(`VaAlert load event: ${headline}`);
};

const CONTENT = `We’ll send notifications about your VA health care and benefits to this email.`;
const VA_PROFILE_EMAIL_HREF =
  '/profile/contact-information#contact-email-address';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-44682&t=CogySEDQUAcvZwHQ-4
const AlertConfirmContactEmail = ({
  emailAddress,
  recordLoadEvent = () => {},
  onConfirmClick = () => {},
}) => {
  const headline = 'Confirm your contact email';

  useEffect(() => recordLoadEvent(headline), [headline, recordLoadEvent]);

  return (
    <VaAlert
      status="warning"
      dataTestid="alert-confirm-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">{headline}</h2>
      <React.Fragment key=".1">
        <p>{CONTENT}</p>
        <p className="vads-u-font-weight--bold">{emailAddress}</p>
        <p>
          <VaButton onClick={() => onConfirmClick()} fullWidth text="Confirm" />
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
  recordLoadEvent: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-45009&t=CogySEDQUAcvZwHQ-4
const AlertAddContactEmail = ({
  recordLoadEvent = () => {},
  onSkipClick = () => {},
}) => {
  const headline = 'Add a contact email';

  useEffect(() => recordLoadEvent(headline), [headline, recordLoadEvent]);

  return (
    <VaAlert
      status="warning"
      dataTestid="alert-add-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">{headline}</h2>
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
            onClick={() => onSkipClick()}
            text="Skip adding email"
          />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertAddContactEmail.propTypes = {
  recordLoadEvent: PropTypes.func.isRequired,
  onSkipClick: PropTypes.func.isRequired,
};

/**
 * `<AlertConfirmEmail />` component
 *
 * Alert to confirm or add a contact email address at `/my-health` and `/my-va` paths.
 *
 * To view specification, run:
 *   `yarn test:unit src/platform/mhv/tests/components/AlertConfirmEmail.unit.spec.jsx --reporter=spec`
 *
 * @returns {JSX.Element|null} `<AlertConfirmContactEmail />`, `<AlertAddContactEmail />`, or null
 */
const AlertConfirmEmail = ({ recordLoadEvent = _recordLoadEvent }) => {
  const renderAlert = useSelector(showAlert);
  const emailAddress = useSelector(selectContactEmailAddress);
  const [dismissed, setDismissed] = useState(false);

  const putConfirmationDate = (confirmationDate = new Date().toISOString()) =>
    apiRequest('/profile/email_addresses', {
      method: 'PUT',
      body: JSON.stringify({ confirmationDate, emailAddress }),
    })
      .then(() => setDismissed(true))
      .then(() => dismissAlertViaCookie());

  const onSkipClick = () => {
    setDismissed(true);
    dismissAlertViaCookie();
  };

  if (!renderAlert || dismissed) return null;

  return emailAddress ? (
    <AlertConfirmContactEmail
      emailAddress={emailAddress}
      onConfirmClick={putConfirmationDate}
      recordLoadEvent={recordLoadEvent}
    />
  ) : (
    <AlertAddContactEmail
      onSkipClick={onSkipClick}
      recordLoadEvent={recordLoadEvent}
    />
  );
};

AlertConfirmEmail.propTypes = {
  recordLoadEvent: PropTypes.func.isRequired,
};

export default AlertConfirmEmail;
