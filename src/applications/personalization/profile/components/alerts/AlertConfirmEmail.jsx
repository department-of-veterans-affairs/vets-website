import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';
import { dismissAlertViaCookie, showAlertConfirmEmail } from '../../selectors';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45235&t=t55H62nbe7HYOvFq-4
const AlertConfirmContactEmail = ({ onClick = () => {} }) => {
  return (
    <VaAlert status="warning" dataTestid="alert-confirm-contact-email">
      <h2 slot="headline">Confirm your contact email</h2>
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
          <VaButton text="Confirm contact email" onClick={onClick} />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  onClick: PropTypes.func.isRequired,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45893&t=t55H62nbe7HYOvFq-4
const AlertAddContactEmail = ({ onClick = () => {} }) => {
  return (
    <VaAlert status="warning" dataTestid="alert-add-contact-email">
      <h2 slot="headline">Add a contact email</h2>
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
          <VaButton text="Skip adding an email" onClick={onClick} secondary />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertAddContactEmail.propTypes = {
  onClick: PropTypes.func.isRequired,
};

/**
 * <AlertConfirmEmail /> component
 *
 * Shows an alert to confirm or add a contact email address at the /profile/contact-information path
 *
 * To view specification, run:
 *   `yarn test:unit src/applications/personalization/profile/tests/components/alerts/AlertConfirmEmail.unit.spec.jsx --reporter=spec`
 *
 * @returns {JSX.Element|null} <AlertConfirmContactEmail />, <AlertAddContactEmail />, or null
 */
const AlertConfirmEmail = () => {
  const showAlert = useSelector(showAlertConfirmEmail);
  const email = useSelector(selectVAPContactInfo)?.email?.emailAddress;
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

  if (!showAlert || dismissed) return null;

  return email ? (
    <AlertConfirmContactEmail onClick={putConfirmationDate} />
  ) : (
    <AlertAddContactEmail onClick={onSkipClick} />
  );
};

AlertConfirmEmail.propTypes = {
  recordEventFn: PropTypes.func,
};

export default AlertConfirmEmail;
