import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  dismissAlertViaCookie,
  selectContactEmailAddress,
  selectContactEmailAddressId,
  showAlert,
} from './selectors';
import {
  AlertSystemResponseConfirmError,
  AlertSystemResponseConfirmSuccess,
  AlertSystemResponseSkipSuccess,
} from './AlertSystemResponse';
import { recordAlertLoadEvent } from './recordAlertLoadEvent';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45235&t=t55H62nbe7HYOvFq-4
const AlertConfirmContactEmail = ({ recordEvent, onClick }) => {
  const headline = 'Confirm your contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status="warning"
      role="status"
      dataTestid="profile-alert--confirm-contact-email"
    >
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
          <VaButton text="Confirm contact email" onClick={() => onClick()} />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  recordEvent: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45893&t=t55H62nbe7HYOvFq-4
const AlertAddContactEmail = ({ recordEvent, onClick }) => {
  const headline = 'Add a contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status="warning"
      role="status"
      dataTestid="profile-alert--add-contact-email"
    >
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
  const emailAddressId = useSelector(selectContactEmailAddressId);

  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [skipSuccess, setSkipSuccess] = useState(false);

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

  const putConfirmationDate = (confirmationDate = new Date().toISOString()) =>
    apiRequest('/profile/email_addresses', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        id: emailAddressId,
        confirmation_date: confirmationDate, // eslint-disable-line camelcase
        email_address: emailAddress, // eslint-disable-line camelcase
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

  if (skipSuccess)
    return (
      <AlertSystemResponseSkipSuccess recordEvent={recordEvent} tabIndex={-1} />
    );

  if (!renderAlert) return null;

  return (
    <div className="vads-u-margin-top--1">
      {emailAddress ? (
        <>
          {confirmSuccess && (
            <AlertSystemResponseConfirmSuccess
              recordEvent={recordEvent}
              tabIndex={-1}
            />
          )}
          {confirmError && (
            <AlertSystemResponseConfirmError
              recordEvent={recordEvent}
              tabIndex={-1}
            />
          )}
          {!confirmSuccess && (
            <AlertConfirmContactEmail
              onClick={putConfirmationDate}
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
