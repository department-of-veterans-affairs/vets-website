import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  dismissAlertViaCookie,
  selectContactEmailAddress,
  selectContactEmailAddressId,
  showAlert,
} from './selectors';
import {
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
  const emailAddressId = useSelector(selectContactEmailAddressId);

  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [skipSuccess, setSkipSuccess] = useState(false);

  useEffect(
    () => {
      if (confirmSuccess) {
        waitForRenderThenFocus('[data-testid="mhv-alert--confirm-success"]');
      } else if (skipSuccess) {
        waitForRenderThenFocus('[data-testid="mhv-alert--skip-success"]');
      }
    },
    [confirmSuccess, confirmError, skipSuccess],
  );

  const putConfirmationDate = (confirmationDate = new Date().toISOString()) =>
    apiRequest('/profile/email_addresses', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        id: emailAddressId,
        // eslint-disable-next-line camelcase
        confirmation_date: confirmationDate,
        // eslint-disable-next-line camelcase
        email_address: emailAddress,
      }),
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
        <AlertSystemResponseConfirmSuccess
          recordEvent={recordEvent}
          tabIndex={-1}
        />
      )}
      {!confirmSuccess && (
        <AlertConfirmContactEmail
          emailAddress={emailAddress}
          onConfirmClick={putConfirmationDate}
          recordEvent={recordEvent}
          confirmError={confirmError}
        />
      )}
    </>
  ) : (
    <>
      {skipSuccess && (
        <AlertSystemResponseSkipSuccess
          recordEvent={recordEvent}
          tabIndex={-1}
        />
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
