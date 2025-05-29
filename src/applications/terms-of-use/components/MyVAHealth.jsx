import React, { useEffect, useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import { useSelector } from 'react-redux';
import ContactCenterInformation from 'platform/user/authentication/components/ContactCenterInformation';
import { selectProfile, profileHasEHRM, profileHasVista } from '../selectors';
import TermsAcceptance from './TermsAcceptanceAction';
import { parseRedirectUrl, touUpdatedDate, declineAndLogout } from '../helpers';
import {
  touStyles,
  errorMessages,
  errorCodes,
  datadogEvents,
} from '../constants';
import touData from '../touData';

const redirectToErrorPage = errorCode => {
  // Add Datadog event tracking for error codes 110 and 111
  if (
    errorCode === errorCodes.GENERAL_ERROR ||
    errorCode === errorCodes.ACCOUNT_PROVISIONING_ERROR
  ) {
    // Use datadogRum for user actions
    if (datadogRum) {
      datadogRum.addAction(datadogEvents.ERROR, {
        errorCode,
      });
    }

    // Use datadogLogs for error logging with additional context
    if (datadogLogs) {
      datadogLogs.logger.error(datadogEvents.ERROR, {
        errorCode,
        redirectUrl: `${
          environment.BASE_URL
        }/auth/login/callback/?auth=fail&code=${errorCode}`,
      });
    }
  }

  window.location = `${
    environment.BASE_URL
  }/auth/login/callback/?auth=fail&code=${errorCode}`;
};

const defaultMessage = {
  loadingMessage: 'Provisioning your acount...',
  isLoading: false,
};

export default function MyVAHealth() {
  const [{ loadingMessage, isLoading }, setLoadingMessage] = useState(
    defaultMessage,
  );
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [error, setError] = useState({ isError: false, message: '' });
  const [displayTerms, setDisplayTerms] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const url = new URL(window.location);
  const ssoeTarget = url.searchParams.get('ssoeTarget');
  const profile = useSelector(selectProfile);

  useEffect(
    () => {
      if (ssoeTarget) {
        apiRequest(`/terms_of_use_agreements/update_provisioning`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
          .then(response => {
            if (response?.provisioned) {
              window.location = parseRedirectUrl(
                decodeURIComponent(ssoeTarget),
              );
            } else {
              // Add additional context to Datadog event for error code 111
              if (datadogRum) {
                datadogRum.addAction(datadogEvents.PROVISIONING_FAILED, {
                  errorCode: errorCodes.ACCOUNT_PROVISIONING_ERROR,
                  hasEHRM: profileHasEHRM({ profile }),
                  hasVista: profileHasVista({ profile }),
                });
              }

              // Log the error with datadogLogs
              if (datadogLogs) {
                datadogLogs.logger.error(datadogEvents.PROVISIONING_FAILED, {
                  errorCode: errorCodes.ACCOUNT_PROVISIONING_ERROR,
                  hasEHRM: profileHasEHRM({ profile }),
                  hasVista: profileHasVista({ profile }),
                });
              }

              redirectToErrorPage(errorCodes.ACCOUNT_PROVISIONING_ERROR);
            }
          })
          .catch(err => {
            const message = err?.error;
            if (message === 'Agreement not accepted') {
              setDisplayTerms(true);
            } else if (message === 'Account not Provisioned') {
              // Add additional context to Datadog event for error code 111
              if (datadogRum) {
                datadogRum.addAction(datadogEvents.ACCOUNT_NOT_PROVISIONED, {
                  errorCode: errorCodes.ACCOUNT_PROVISIONING_ERROR,
                  errorMessage: message,
                  hasEHRM: profileHasEHRM({ profile }),
                  hasVista: profileHasVista({ profile }),
                });
              }

              // Log the error with datadogLogs
              if (datadogLogs) {
                datadogLogs.logger.error(
                  datadogEvents.ACCOUNT_NOT_PROVISIONED,
                  {
                    errorCode: errorCodes.ACCOUNT_PROVISIONING_ERROR,
                    errorMessage: message,
                    hasEHRM: profileHasEHRM({ profile }),
                    hasVista: profileHasVista({ profile }),
                  },
                );
              }

              redirectToErrorPage(errorCodes.ACCOUNT_PROVISIONING_ERROR);
            } else {
              setError({
                isError: true,
                message: errorMessages.network,
              });
              // Add additional context to Datadog event for error code 110
              if (datadogRum) {
                datadogRum.addAction(datadogEvents.NETWORK_ERROR, {
                  errorCode: errorCodes.GENERAL_ERROR,
                  errorMessage: message || 'Unknown error',
                  hasEHRM: profileHasEHRM({ profile }),
                  hasVista: profileHasVista({ profile }),
                });
              }

              // Log the error with datadogLogs
              if (datadogLogs) {
                datadogLogs.logger.error(datadogEvents.NETWORK_ERROR, {
                  errorCode: errorCodes.GENERAL_ERROR,
                  errorMessage: message || 'Unknown error',
                  hasEHRM: profileHasEHRM({ profile }),
                  hasVista: profileHasVista({ profile }),
                });
              }

              redirectToErrorPage(errorCodes.GENERAL_ERROR);
            }
          });
      }
    },
    [ssoeTarget, profile],
  );

  const handleTouClick = async type => {
    const cernerType = type === 'accept' ? 'accept_and_provision' : type;

    try {
      setIsDisabled(true);
      setLoadingMessage(prev => ({ ...prev, isLoading: true }));
      const response = await apiRequest(
        `/terms_of_use_agreements/v1/${cernerType}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      // if the type was accept
      if (response && type === 'accept') {
        setLoadingMessage(defaultMessage);
        setIsDisabled(false);
        window.location = parseRedirectUrl(decodeURIComponent(ssoeTarget));
      }

      // if the type was decline
      if (response && type === 'decline') {
        setShowDeclineModal(false);
        setIsDisabled(false);
        declineAndLogout({
          termsCodeExists: false,
          shouldRedirectToMobile: false,
          isAuthenticatedWithSiS: false,
        });
      }
    } catch (err) {
      setError({ isError: true, message: errorMessages.network });
      setIsDisabled(false);

      // Add additional context to Datadog event for error code 110 during accept/decline
      if (datadogRum) {
        datadogRum.addAction(datadogEvents.API_ERROR_DURING_ACTION, {
          errorCode: errorCodes.GENERAL_ERROR,
          action: type,
          errorMessage: err?.error || 'Unknown error',
          hasEHRM: profileHasEHRM({ profile }),
          hasVista: profileHasVista({ profile }),
        });
      }

      // Log the error with datadogLogs
      if (datadogLogs) {
        datadogLogs.logger.error(datadogEvents.API_ERROR_DURING_ACTION, {
          errorCode: errorCodes.GENERAL_ERROR,
          action: type,
          errorMessage: err?.error || 'Unknown error',
          hasEHRM: profileHasEHRM({ profile }),
          hasVista: profileHasVista({ profile }),
        });
      }

      // fatal or network error redirect to 110 page
      redirectToErrorPage(errorCodes.GENERAL_ERROR);
    }
  };

  return (
    <div className="vads-u-margin-y--2">
      <style>{touStyles}</style>
      {!displayTerms && (
        <va-loading-indicator set-focus message={loadingMessage} />
      )}
      <section className="usa-grid usa-grid-full">
        <article className="usa-content vads-u-padding-x--1 medium-screen:vads-u-padding-x--0">
          {!displayTerms &&
            error.isError && (
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
          {displayTerms && (
            <>
              <h1>VA online services terms of use</h1>
              <p className="va-introtext">
                To sign in, you’ll need to accept the updated terms of use. Read
                the updated terms on this page. Then confirm if you accept.
              </p>
              <div>
                <p>
                  Version: 1<br />
                  Last updated: {touUpdatedDate}
                </p>
              </div>
              <h2 id="terms-of-use">Terms of use</h2>
              <div>
                <va-accordion bordered>
                  {touData?.map(({ header, content }, i) => (
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
                Your decision to decline these terms won’t affect your
                eligibility for VA health care and benefits in any way. You can
                still get VA health care and benefits without using online
                services. If you need help or have questions,{' '}
                <ContactCenterInformation /> We’re here 24/7.
              </p>
              <va-alert status="warning" visible>
                <h3 slot="headline" id="what-happens-if-you-decline">
                  What will happen if you decline
                </h3>
                <p>
                  If you decline these terms, we’ll sign you out. You can still
                  get VA health care and benefits by phone, by mail, or in
                  person. But you won't be able to use some VA online services,
                  including these services:
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
              {isLoading && (
                <va-loading-indicator set-focus message={loadingMessage} />
              )}
              <TermsAcceptance
                error={error}
                isDisabled={isDisabled}
                isMiddleAuth
                handleTouClick={handleTouClick}
                setShowDeclineModal={setShowDeclineModal}
                isFullyAuthenticated
                isUnauthenticated={false}
              />
            </>
          )}
        </article>
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
    </div>
  );
}
