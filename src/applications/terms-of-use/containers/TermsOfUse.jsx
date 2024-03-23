import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  isAuthenticatedWithOAuth,
  isAuthenticatedWithSSOe,
  AUTHN_SETTINGS,
} from '@department-of-veterans-affairs/platform-user/exports';
import IdentityPhone from 'platform/user/authentication/components/IdentityPhone';
import TermsAcceptance from '../components/TermsAcceptanceAction';
import {
  parseRedirectUrl,
  declineAndLogout,
  validateWhichRedirectUrlToUse,
} from '../helpers';
import { touStyles, errorMessages } from '../constants';
import touData from '../touData';

const touUpdatedDate = `September 2023`;

export default function TermsOfUse() {
  const isAuthenticatedWithSiS = useSelector(isAuthenticatedWithOAuth);
  const isAuthenticatedWithIAM = useSelector(isAuthenticatedWithSSOe);
  const [isMiddleAuth, setIsMiddleAuth] = useState(true);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [error, setError] = useState({ isError: false, message: '' });
  const redirectLocation = new URL(window.location);
  const termsCodeExists =
    redirectLocation.searchParams.get('terms_code')?.length > 1;
  const redirectUrl = validateWhichRedirectUrlToUse(redirectLocation);
  const shouldRedirectToMobile = sessionStorage.getItem('ci') === 'vamobile';
  const isFullyAuthenticated = isAuthenticatedWithIAM || isAuthenticatedWithSiS;
  const isUnauthenticated = !isMiddleAuth && !isFullyAuthenticated;

  useEffect(
    () => {
      if (!termsCodeExists) {
        apiRequest('/terms_of_use_agreements/v1/latest').catch(response => {
          const [{ code, title }] = response.errors;
          if (code === '401' || title?.includes('Not authorized')) {
            setIsMiddleAuth(false);
          }
        });
      }

      if (redirectUrl) {
        sessionStorage.setItem(
          AUTHN_SETTINGS.RETURN_URL,
          parseRedirectUrl(redirectUrl),
        );
      }
    },
    [termsCodeExists, redirectUrl],
  );

  const handleTouClick = async type => {
    const termsCode = termsCodeExists
      ? `?terms_code=${redirectLocation.searchParams.get('terms_code')}`
      : '';

    try {
      const response = await apiRequest(
        `/terms_of_use_agreements/v1/${type}${termsCode}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (Object.keys(response?.termsOfUseAgreement).length) {
        // if the type was accept
        if (type === 'accept') {
          window.location = parseRedirectUrl(redirectUrl);
        }

        if (type === 'decline') {
          setShowDeclineModal(false);
          declineAndLogout({
            termsCodeExists,
            shouldRedirectToMobile,
            isAuthenticatedWithSiS,
          });
        }
      }
    } catch (err) {
      if (type === 'decline') setShowDeclineModal(true);
      setError({ isError: true, message: errorMessages.network });
    }
  };

  return (
    <>
      {isMiddleAuth &&
        !isFullyAuthenticated &&
        !isUnauthenticated && <style>{touStyles}</style>}
      <section className="vads-l-grid-container vads-u-padding-y--5">
        <div className="usa-content">
          <h1 className="vads-u-padding-x--1 medium-screen:vads-u-padding-x--0">
            VA online services terms of use
          </h1>
          <p className="va-introtext vads-u-padding-x--1 medium-screen:vads-u-padding-x--0">
            {isUnauthenticated &&
              'We’ve recently updated our terms of use for VA.gov and other VA online services. Read the updated terms on this page. If you haven’t yet accepted these terms, you can sign in and accept them now.'}
            {isMiddleAuth &&
              !isFullyAuthenticated &&
              !isUnauthenticated &&
              'To sign in, you’ll need to accept the updated terms of use. Read the updated terms on this page. Then confirm if you accept.'}
            {isFullyAuthenticated &&
              'You previously accepted these terms of use. If you want to change your answer, you can decline the terms on this page.'}
          </p>
          {isUnauthenticated && (
            <div className="vads-u-margin-y--2p5">
              <a
                className="vads-c-action-link--blue"
                href="/terms-of-use/?next=loginModal"
              >
                Sign in to VA.gov
              </a>
            </div>
          )}
          <article>
            <div>
              <p>
                Version: 1<br />
                Last updated: {touUpdatedDate}
              </p>
            </div>
            <h2 id="terms-of-use">Terms of use</h2>
            <div>
              <va-accordion bordered>
                {touData.map(({ header, content }, i) => (
                  <va-accordion-item
                    header={header}
                    level={3}
                    key={header}
                    part={`item-${i}`}
                  >
                    {content}
                  </va-accordion-item>
                ))}
              </va-accordion>
            </div>
            <h2 id="getting-va-benefits-and-services">
              Getting VA benefits and services if you don’t accept
            </h2>
            <p>
              Your decision to decline these terms won’t affect your eligibility
              for VA health care and benefits in any way. You can still get VA
              health care and benefits without using online services. If you
              need help or have questions, <IdentityPhone /> We’re here 24/7.
            </p>
            <va-alert status="warning" visible>
              <h3 slot="headline" id="what-happens-if-you-decline">
                What will happen if you decline
              </h3>
              <p>
                If you decline these terms, we’ll sign you out. You can still
                get VA health care and benefits by phone, by mail, or in person.
                But you won't be able to use some VA online services, including
                these services:
              </p>
              <ul>
                <li>VA.gov</li>
                <li>My HealtheVet</li>
                <li>My VA Health</li>
                <li>VA Health and Benefits Mobile App</li>
              </ul>
              <p>
                This means you won’t be able to do these types of things using
                VA online services:
              </p>
              <ul>
                <li>Apply for some benefits</li>
                <li>Check your claim status</li>
                <li>Send messages to your VA health care providers</li>
                <li>Refill your prescriptions</li>
                <li>Update your personal information</li>
              </ul>
            </va-alert>
            <TermsAcceptance
              error={error}
              isMiddleAuth={isMiddleAuth}
              handleTouClick={handleTouClick}
              setShowDeclineModal={setShowDeclineModal}
              isFullyAuthenticated={isFullyAuthenticated}
              isUnauthenticated={isUnauthenticated}
            />
          </article>
        </div>
        <VaModal
          visible={showDeclineModal}
          clickToClose
          onCloseEvent={() => setShowDeclineModal(false)}
          modalTitle="Decline the terms of use and sign out?"
          onPrimaryButtonClick={() => handleTouClick('decline')}
          onSecondaryButtonClick={() => setShowDeclineModal(false)}
          primaryButtonText="Decline and sign out"
          secondaryButtonText="Go back"
          data-testid="modal-show"
        >
          {error.isError && (
            <va-alert
              status="error"
              slim
              visible
              uswds
              class="vads-u-margin-y--1p5"
            >
              {error.message}
            </va-alert>
          )}
        </VaModal>
      </section>
    </>
  );
}
