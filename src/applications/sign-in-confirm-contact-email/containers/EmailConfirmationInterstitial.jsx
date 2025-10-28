import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { AUTHN_SETTINGS } from '@department-of-veterans-affairs/platform-user/exports';
import SuccessConfirm from '../components/alerts/SuccessConfirm';
import ErrorConfirm from '../components/alerts/ErrorConfirm';
import ConfirmAddBtnGroup from '../components/ConfirmAddBtnGroup';

export default function EmailConfirmationInterstitial() {
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);

  useEffect(() => {
    document.title = 'Confirm your contact email address';
    if (!localStorage.getItem('hasSession')) {
      window.location.pathname = '/';
    }
  }, []);

  const { emailAddress = 'No email provided', id } = useSelector(
    selectUser,
  ).vet360ContactInformation?.email;

  const returnUrl =
    sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '/my-va';

  const handleConfirmation = () => {
    apiRequest('/v0/profile/email_addresses', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        // eslint-disable-next-line camelcase
        email_address: emailAddress,
        // eslint-disable-next-line camelcase
        confirmation_date: new Date().toISOString(),
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        setConfirmationSuccess(true);
        setConfirmationError(false);
      })
      .catch(() => {
        setConfirmationError(true);
        setConfirmationSuccess(false);
      });
  };

  return (
    <>
      <section className="container row login vads-u-padding--3">
        <h1>Confirm your contact email</h1>
        {confirmationSuccess && <SuccessConfirm />}
        {confirmationError && <ErrorConfirm />}
        <div className="vads-u-margin-y--1">
          <va-card icon-name="" className="vads-u-width--100">
            <h2 className="vads-u-margin-top--0">Contact email address</h2>
            <p>
              We'll send notifications about your VA health care and benefits to
              this email.
            </p>
            <p>
              <strong>{emailAddress}</strong>
            </p>
          </va-card>
        </div>
        {!confirmationSuccess && (
          <ConfirmAddBtnGroup
            email={emailAddress}
            handleConfirmation={handleConfirmation}
          />
        )}
        {confirmationSuccess ? (
          <va-link-action
            href={returnUrl}
            label="continue to va.gov"
            text="Continue to VA.gov"
            type="primary"
          />
        ) : (
          <div className="vads-u-margin-y--2">
            <va-link text="Skip for now and go to VA.gov" href={returnUrl} />
          </div>
        )}
        <div>
          <h2 className="vads-u-margin-top--0">What's changing</h2>
          <p>
            We'll send all VA notifications to the contact email address listed
            in your VA.gov profile. We won't send any more notifications to the
            email listed in the previous MyHealtheVet experience. Make sure the
            contact email address listed in your VA.gov profile is the one you
            want us to send notifications to.
          </p>
        </div>
      </section>
    </>
  );
}
