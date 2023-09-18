import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  apiRequest,
  environment,
  eauthEnvironmentPrefixes,
  cernerEnvPrefixes,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import {
  termsOfUseEnabled,
  isLoggedIn,
  logout as IAMLogout,
} from '@department-of-veterans-affairs/platform-user/exports';
import touData from '../touData';

const touUpdatedDate = `March 2023`;
const defaultErrorMessage = `Something went wrong on our end. Please try again in a few
              minutes.`;

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
    return parsedUrl;
  }
  return `${environment.BASE_URL}`;
};

export default function TermsOfUse() {
  const termsOfUseAuthorized = useSelector(termsOfUseEnabled);
  const loggedIn = useSelector(isLoggedIn);
  const [error, setError] = useState({ isError: false, message: '' });

  const handleTouClick = async type => {
    let isAware;
    if (type === 'decline') {
      // eslint-disable-next-line no-alert
      isAware = confirm(
        `We’ll automatically sign you out and take you back to the VA.gov homepage. And you won’t be able to sign in to use these tools: VA.gov, My HealtheVet, My VA Health, or the Mobile app.\n\nAre you sure you want to decline?`,
      );
    }
    const url = new URL(window.location);
    const redirectUrl = parseRedirectUrl(url.searchParams.get('redirect_url'));
    if (type === 'accept' || (type === 'decline' && isAware)) {
      try {
        const response = await apiRequest(
          `/terms_of_use_agreements/v1/${type}`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (response.errors) {
          setError({
            isError: true,
            message: defaultErrorMessage,
          });
        }

        if (Object.keys(response?.termsOfUseAgreement).length) {
          // if the type was accept
          if (type === 'accept') {
            window.location = redirectUrl;
          }

          if (type === 'decline') {
            IAMLogout({
              queryParams: {
                [`redirect_url`]: `${
                  environment.BASE_URL
                }/terms-of-use/declined`,
              },
            });
          }
        }
      } catch (err) {
        setError({
          isError: true,
          message: defaultErrorMessage,
        });
      }
    }
  };
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
            health care and benefits in-person without using online services. If
            you need help or have questions, <SubmitSignInForm /> We’re here
            24/7.
          </p>
          <va-alert status="warning" visible>
            <h3 slot="headline" id="what-happens-if-you-decline">
              What will happen if you decline
            </h3>
            <p>
              If you decline these terms, we'll automatically sign you out and
              take you back to the VA.gov homepage. And you won't be able to
              sign in to use some VA online services, like:
            </p>
            <ul>
              <li>VA.gov</li>
              <li>My HealtheVet</li>
              <li>My VA Health</li>
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
          <h2 id="do-you-accept-of-terms-of-use">
            Do you accept these terms of use?
          </h2>
          {!loggedIn &&
            termsOfUseAuthorized && (
              <>
                <va-button
                  text="Accept"
                  onClick={() => handleTouClick('accept')}
                  ariaLabel="I Accept to VA online serivices terms of use"
                />
                <va-button
                  text="Decline"
                  secondary
                  ariaLabel="I Decline to VA online serivices terms of use"
                  onClick={() => handleTouClick('decline')}
                />
              </>
            )}
          {error.isError && <p>{error.message}</p>}
        </article>
      </div>
    </section>
  );
}
