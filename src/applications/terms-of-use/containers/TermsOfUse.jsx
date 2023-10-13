import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  apiRequest,
  environment,
  eauthEnvironmentPrefixes,
  cernerEnvPrefixes,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import {
  termsOfUseEnabled,
  logout as IAMLogout,
} from '@department-of-veterans-affairs/platform-user/exports';
import touData from '../touData';

const touUpdatedDate = `September 2023`;
export const errorMessages = {
  network: `We had a connection issue on our end. Please try again in a few minutes.`,
};

export const parseRedirectUrl = url => {
  if (url === null) {
    return `${environment.BASE_URL}`;
  }

  const parsedUrl = decodeURIComponent(url);
  const allowedDomains = [
    `${new URL(environment.BASE_URL).hostname}`, // va.gov
    `${eauthEnvironmentPrefixes[environment.BUILDTYPE]}eauth.va.gov`, // eauth
    `${cernerEnvPrefixes[environment.BUILDTYPE]}patientportal.myhealth.va.gov`, // cerner
    `${eauthEnvironmentPrefixes[environment.BUILDTYPE]}fed.eauth.va.gov`, // mobile
  ];

  const domain = new URL(parsedUrl).hostname;

  if (allowedDomains.includes(domain)) {
    return parsedUrl.includes('mhv-portal-web') &&
      !parsedUrl.includes('?deeplinking=')
      ? parsedUrl.replace('&postLogin=true', '')
      : parsedUrl;
  }
  return `${environment.BASE_URL}`;
};

export default function TermsOfUse() {
  const termsOfUseAuthorized = useSelector(termsOfUseEnabled);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [error, setError] = useState({ isError: false, message: '' });
  const termsCodeExists =
    new URL(window.location).searchParams.get('terms_code')?.length > 1;

  useEffect(
    () => {
      if (!termsCodeExists) {
        apiRequest('/terms_of_use_agreements/v1/latest').catch(response => {
          const [{ code, title }] = response.errors;
          if (code === '401' || title?.includes('Not authorized')) {
            setIsAuthenticated(false);
          }
        });
      }
    },
    [termsCodeExists],
  );

  const handleTouClick = async type => {
    const url = new URL(window.location);
    const redirectUrl = parseRedirectUrl(url.searchParams.get('redirect_url'));
    const termsCode = termsCodeExists
      ? `?terms_code=${url.searchParams.get('terms_code')}`
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
          window.location = redirectUrl;
        }

        if (type === 'decline') {
          setShowDeclineModal(false);
          IAMLogout({
            queryParams: {
              [`redirect_url`]: `${environment.BASE_URL}/terms-of-use/declined`,
            },
          });
        }
      }
    } catch (err) {
      if (type === 'decline') setShowDeclineModal(true);
      setError({
        isError: true,
        message: errorMessages.network,
      });
    }
  };
  const className = !isAuthenticated ? 'hidden' : '';

  return (
    <section className="vads-l-grid-container vads-u-padding-y--5 vads-u-padding-x--0">
      <div className="usa-content">
        <h1>VA online services terms of use</h1>
        <p className="va-introtext">
          To sign in to VA.gov and most other VA online services, you’ll need to
          accept the terms of use. We recently updated the terms. Read the
          updated terms on this page. Then confirm if you accept or not.
        </p>
        <article>
          <va-on-this-page />
          <div>
            <p>
              Version: 1<br />
              Last updated: {touUpdatedDate}
            </p>
          </div>
          <h2 id="terms-of-use">Terms of use</h2>
          <p>
            The Department of Veterans Affairs (VA) owns and manages VA.gov and
            the My HealtheVet health management portal. VA.gov allows you to use
            online tools that display parts of your personal health information.
            This health information is only displayed on VA.gov &mdash; the
            information is stored on VA protected federal computer systems and
            networks. VA supports the secure storage and transmission of all
            information on VA.gov.
          </p>
          <div>
            <va-accordion bordered>
              {touData.map(({ header, content }) => (
                <va-accordion-item header={header} level={3} key={header}>
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
            health care and benefits without using online services. If you need
            help or have questions, <SubmitSignInForm /> We’re here 24/7.
          </p>
          <va-alert status="warning" visible>
            <h3 slot="headline" id="what-happens-if-you-decline">
              What will happen if you decline
            </h3>
            <p>
              If you decline these terms, we’ll sign you out. You can still get
              VA health care and benefits by phone, by mail, or in person. But
              you won't be able to use some online services, like:
            </p>
            <ul>
              <li>VA.gov</li>
              <li>My HealtheVet</li>
              <li>My VA Health</li>
              <li>VA Health and Benefits Mobile App</li>
            </ul>
            <p>
              This means you won’t be able to do these types of things using VA
              online services:
            </p>
            <ul>
              <li>Apply for some benefits</li>
              <li>Check your claim status</li>
              <li>Send messages to your VA health care providers</li>
              <li>Refill your prescriptions</li>
              <li>Update your personal information</li>
            </ul>
          </va-alert>
          <h2 id="do-you-accept-of-terms-of-use" className={className}>
            Do you accept these terms of use?
          </h2>
          {error.isError && (
            <va-alert
              status="error"
              slim
              visible
              uswds
              data-testid="error-non-modal"
              class="vads-u-margin-y--1p5"
            >
              {error.message}
            </va-alert>
          )}
          {isAuthenticated &&
            termsOfUseAuthorized && (
              <>
                <va-button
                  data-testid="accept"
                  text="Accept"
                  onClick={() => handleTouClick('accept')}
                  ariaLabel="I accept the VA online services terms of use"
                />
                <va-button
                  data-testid="decline"
                  text="Decline"
                  secondary
                  ariaLabel="I decline the VA online services terms of use"
                  onClick={() => setShowDeclineModal(true)}
                />
              </>
            )}
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
  );
}
