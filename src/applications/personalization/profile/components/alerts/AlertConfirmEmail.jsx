import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { datadogRum } from '@datadog/browser-rum';
import {
  dismissAlertViaCookie,
  selectContactEmailAddress,
  showAlertConfirmEmail,
} from '../../selectors';

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

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45235&t=t55H62nbe7HYOvFq-4
const AlertConfirmContactEmail = ({
  recordLoadEvent = () => {},
  onClick = () => {},
}) => {
  const headline = 'Confirm your contact email';

  useEffect(() => recordLoadEvent(headline), [headline, recordLoadEvent]);

  return (
    <VaAlert status="warning" dataTestid="alert-confirm-contact-email">
      <h2 slot="headline">{headline}</h2>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p>
          If your contact email below is correct, click the button to confirm.
          If not, use the edit button to update.
        </p>
        <p>
          <VaButton text="Confirm contact email" onClick={() => onClick()} />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  recordLoadEvent: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45893&t=t55H62nbe7HYOvFq-4
const AlertAddContactEmail = ({
  recordLoadEvent = () => {},
  onClick = () => {},
}) => {
  const headline = 'Add a contact email';

  useEffect(() => recordLoadEvent(headline), [headline, recordLoadEvent]);

  return (
    <VaAlert status="warning" dataTestid="alert-add-contact-email">
      <h2 slot="headline">{headline}</h2>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p>Add a contact email by clicking the add button below.</p>
        <p>
          Or if you’d rather not get email notifications, you may choose to skip
          adding an email.
        </p>
        <p>
          <VaButton
            text="Skip adding an email"
            onClick={() => onClick()}
            secondary
          />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertAddContactEmail.propTypes = {
  recordLoadEvent: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

/**
 * `<AlertConfirmEmail />` component
 *
 * Alert to confirm or add a contact email address at the `/profile/contact-information` path
 *
 * To view specification, run:
 *   `yarn test:unit src/applications/personalization/profile/tests/components/alerts/AlertConfirmEmail.unit.spec.jsx --reporter=spec`
 *
 * @returns {JSX.Element|null} `<AlertConfirmContactEmail />`, `<AlertAddContactEmail />`, or null
 */
const AlertConfirmEmail = ({ recordLoadEvent = _recordLoadEvent }) => {
  const showAlert = useSelector(showAlertConfirmEmail);
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

  if (!showAlert || dismissed) return null;

  return emailAddress ? (
    <AlertConfirmContactEmail
      onClick={putConfirmationDate}
      recordLoadEvent={recordLoadEvent}
    />
  ) : (
    <AlertAddContactEmail
      onClick={onSkipClick}
      recordLoadEvent={recordLoadEvent}
    />
  );
};

AlertConfirmEmail.propTypes = {
  recordLoadEvent: PropTypes.func,
};

export default AlertConfirmEmail;
