import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import {
  dismissAlertViaCookie,
  selectContactEmailAddress,
  showAlert,
} from './selectors';
import {
  AlertSystemResponseConfirmError,
  AlertSystemResponseConfirmSuccess,
  AlertSystemResponseSkipSuccess,
} from './AlertSystemResponse';
import { recordAlertLoadEvent } from './recordAlertLoadEvent';
import ConfirmEmailButton from '../../../user/profile/vap-svc/components/ConfirmEmailButton';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45235&t=t55H62nbe7HYOvFq-4
const AlertConfirmContactEmail = ({
  recordEvent,
  onConfirmSuccess,
  onConfirmError,
  apiAction,
}) => {
  const headline = 'Confirm your contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert status="warning" dataTestid="profile-alert--confirm-contact-email">
      <h2 slot="headline">{headline}</h2>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p>
          If your contact email below is correct, select
          <span className="vads-u-font-weight--bold">
            {' '}
            Confirm contact email
          </span>
          . If not, select{' '}
          <span className="vads-u-font-weight--bold"> Edit </span>
          to update your contact email.
        </p>
        <p>
          <ConfirmEmailButton
            apiAction={apiAction}
            onSuccess={() => onConfirmSuccess && onConfirmSuccess()}
            onError={err => onConfirmError && onConfirmError(err)}
          >
            Confirm contact email
          </ConfirmEmailButton>
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  recordEvent: PropTypes.func.isRequired,
  onConfirmError: PropTypes.func,
  onConfirmSuccess: PropTypes.func,
  apiAction: PropTypes.func,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45893&t=t55H62nbe7HYOvFq-4
const AlertAddContactEmail = ({ recordEvent, onClick }) => {
  const headline = 'Add a contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert status="warning" dataTestid="profile-alert--add-contact-email">
      <h2 slot="headline">{headline}</h2>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p>
          If you want to add a contact email address, select{' '}
          <span className="vads-u-font-weight--bold"> Add</span>. If you don’t
          want to add an email right now, you can select{' '}
          <span className="vads-u-font-weight--bold"> Skip adding email</span>.
        </p>
        <p>
          <VaButton
            text="Skip adding email"
            onClick={() => onClick()}
            secondary
          />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertAddContactEmail.propTypes = {
  recordEvent: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

/**
 * `<ProfileAlertConfirmEmail />` component
 *
  import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
 * Alert to confirm or add a contact email address at the `/profile/contact-information` path
 *
 * To view specification, run:
 *   `yarn test:unit src/platform/mhv/tests/components/ProfileAlertConfirmEmail.unit.spec.jsx --reporter=spec`
 *
 * @returns {JSX.Element|null}
 */
const ProfileAlertConfirmEmail = ({ recordEvent = recordAlertLoadEvent }) => {
  const renderAlert = useSelector(showAlert);
  const emailAddress = useSelector(selectContactEmailAddress);

  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [skipSuccess, setSkipSuccess] = useState(false);

  // When the user confirms their email, use the VAP service transaction
  // flow via the ConfirmEmailButton. The callbacks below mirror the
  // previous behavior of setting success/error flags and dismissing the
  // alert cookie on success.
  const handleConfirmSuccess = () => {
    setConfirmError(false);
    setConfirmSuccess(true);
    dismissAlertViaCookie();
  };

  const handleConfirmError = () => setConfirmError(true);

  const putConfirmationDate = confirmationDate =>
    apiRequest('/profile/email_addresses', {
      method: 'PUT',
      body: JSON.stringify({ confirmationDate, emailAddress }),
    })
      .then(() => handleConfirmSuccess())
      .catch(() => handleConfirmError());

  const onSkipClick = () => {
    setSkipSuccess(true);
    dismissAlertViaCookie();
  };

  if (skipSuccess)
    return <AlertSystemResponseSkipSuccess recordEvent={recordEvent} />;

  if (!renderAlert) return null;

  return (
    <div className="vads-u-margin-top--1">
      {emailAddress ? (
        <>
          {confirmSuccess && (
            <AlertSystemResponseConfirmSuccess recordEvent={recordEvent} />
          )}
          {confirmError && (
            <AlertSystemResponseConfirmError recordEvent={recordEvent} />
          )}
          {!confirmSuccess && (
            <AlertConfirmContactEmail
              apiAction={putConfirmationDate}
              onConfirmSuccess={handleConfirmSuccess}
              onConfirmError={handleConfirmError}
              recordEvent={recordEvent}
            />
          )}
        </>
      ) : (
        <>
          {!skipSuccess && (
            <AlertAddContactEmail
              onClick={onSkipClick}
              recordEvent={recordEvent}
            />
          )}
        </>
      )}
    </div>
  );
};

ProfileAlertConfirmEmail.propTypes = {
  recordEvent: PropTypes.func,
};

export default ProfileAlertConfirmEmail;
