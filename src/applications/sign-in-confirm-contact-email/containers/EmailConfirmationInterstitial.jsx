import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';
import { AUTHN_SETTINGS } from '@department-of-veterans-affairs/platform-user/exports';
import useConfirmEmailTransaction from 'platform/mhv/hooks/useConfirmEmailTransaction';
import SuccessConfirm from '../components/alerts/SuccessConfirm';
import ErrorConfirm from '../components/alerts/ErrorConfirm';
import ConfirmAddBtnGroup from '../components/ConfirmAddBtnGroup';

export default function EmailConfirmationInterstitial() {
  useEffect(() => {
    document.title = 'Confirm your contact email address';
    if (!localStorage.getItem('hasSession')) {
      window.location.pathname = '/';
    }
  }, []);

  const vapContactInfo = useSelector(selectVAPContactInfo);
  const emailAddress =
    vapContactInfo?.email?.emailAddress || 'No email provided';
  const emailAddressId = vapContactInfo?.email?.id;

  const returnUrl =
    sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '/my-va';

  const {
    confirmEmail,
    isLoading: isConfirming,
    isSuccess: confirmationSuccess,
    isError: confirmationError,
  } = useConfirmEmailTransaction({
    emailAddressId,
    emailAddress,
  });

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
              We’ll send notifications about your VA health care and benefits to
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
            handleConfirmation={confirmEmail}
            isConfirming={isConfirming}
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
          <h2 className="vads-u-margin-top--0">What’s changing</h2>
          <p>
            We’ll send all VA notifications to the contact email address listed
            in your VA.gov profile. We won’t send any more notifications to the
            email listed in the previous MyHealtheVet experience. Make sure the
            contact email address listed in your VA.gov profile is the one you
            want us to send notifications to.
          </p>
        </div>
      </section>
    </>
  );
}
