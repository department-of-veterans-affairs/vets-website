import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
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
import AlertConfirmAddContactEmailError from './AlertConfirmAddContactEmailError';
import { recordAlertLoadEvent } from './recordAlertLoadEvent';
import useConfirmEmailTransaction from '../../hooks/useConfirmEmailTransaction';

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

  const [skipSuccess, setSkipSuccess] = useState(false);

  const {
    confirmEmail,
    isLoading,
    isSuccess: confirmSuccess,
    isError: confirmError,
  } = useConfirmEmailTransaction({
    emailAddressId,
    emailAddress,
    onSuccess: () => dismissAlertViaCookie(),
  });

  useEffect(
    () => {
      if (confirmSuccess) {
        waitForRenderThenFocus('[data-testid="mhv-alert--confirm-success"]');
      } else if (confirmError) {
        waitForRenderThenFocus('[data-testid="mhv-alert--confirm-error"]');
      } else if (skipSuccess) {
        waitForRenderThenFocus('[data-testid="mhv-alert--skip-success"]');
      }
    },
    [confirmSuccess, confirmError, skipSuccess],
  );

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
      {confirmError && (
        <AlertConfirmAddContactEmailError
          emailAddress={emailAddress}
          isConfirming={isLoading}
          onConfirmClick={confirmEmail}
          recordEvent={recordEvent}
        />
      )}
      {!confirmSuccess &&
        !confirmError && (
          <AlertConfirmContactEmail
            emailAddress={emailAddress}
            isConfirming={isLoading}
            onConfirmClick={confirmEmail}
            recordEvent={recordEvent}
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
