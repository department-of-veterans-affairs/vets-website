import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
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
import AlertAddContactEmail from './AlertAddContactEmail';
import AlertConfirmContactEmail from './AlertConfirmContactEmail';
import { recordAlertLoadEvent } from './recordAlertLoadEvent';

/**
 * `<MhvAlertConfirmEmail />` component
 *
 * Alert to confirm or add a contact email address at `/my-health` and `/my-va` paths.
 *
 * To view specification, run:
 *   `yarn test:unit src/platform/mhv/tests/components/MhvAlertConfirmEmail.unit.spec.jsx --reporter=spec`
 *
 * @returns {JSX.Element|null}
 */
const MhvAlertConfirmEmail = ({ recordEvent = recordAlertLoadEvent }) => {
  const renderAlert = useSelector(showAlert);
  const emailAddress = useSelector(selectContactEmailAddress);

  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [skipSuccess, setSkipSuccess] = useState(false);

  const putConfirmationDate = (confirmationDate = new Date().toISOString()) =>
    apiRequest('/profile/email_addresses', {
      method: 'PUT',
      body: JSON.stringify({ confirmationDate, emailAddress }),
    })
      .then(() => {
        setConfirmError(false);
        setConfirmSuccess(true);
      })
      .then(() => dismissAlertViaCookie())
      .catch(() => setConfirmError(true));

  const onSkipClick = () => {
    setSkipSuccess(true);
    dismissAlertViaCookie();
  };

  if (!renderAlert) return null;

  return emailAddress ? (
    <>
      {confirmSuccess && (
        <AlertSystemResponseConfirmSuccess recordEvent={recordEvent} />
      )}
      {confirmError && (
        <AlertSystemResponseConfirmError recordEvent={recordEvent} />
      )}
      {!confirmSuccess && (
        <AlertConfirmContactEmail
          emailAddress={emailAddress}
          onConfirmClick={putConfirmationDate}
          recordEvent={recordEvent}
        />
      )}
    </>
  ) : (
    <>
      {skipSuccess && (
        <AlertSystemResponseSkipSuccess recordEvent={recordEvent} />
      )}
      {!skipSuccess && (
        <AlertAddContactEmail
          onSkipClick={onSkipClick}
          recordEvent={recordEvent}
        />
      )}
    </>
  );
};

MhvAlertConfirmEmail.propTypes = {
  recordEvent: PropTypes.func,
};

export default MhvAlertConfirmEmail;
