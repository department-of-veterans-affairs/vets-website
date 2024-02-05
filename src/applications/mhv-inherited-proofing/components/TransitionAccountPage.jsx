import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { transitionMHVAccount } from 'platform/user/authentication/selectors';
import { mhvTransitionEnabled } from 'platform/user/selectors';
import { MHV_TRANSITION_DATE } from 'platform/user/authentication/constants';
import TransitionAccountSteps from './TransitionAccountSteps';

export default function TransitionAccount() {
  // TODO: wait for BE team to add to User model
  const transitionEnabled = useSelector(mhvTransitionEnabled);
  const mhvTransitionEligible = useSelector(transitionMHVAccount);

  const [transitionPage, setTransitionPage] = useState({
    loading: true,
    canTransition: null,
  });

  useEffect(
    () => {
      if (transitionEnabled !== undefined) {
        setTransitionPage({
          loading: false,
          canTransition: Boolean(transitionEnabled && mhvTransitionEligible),
        });
      }
    },
    [transitionEnabled, mhvTransitionEligible],
  );

  return (
    <main className="usa-grid usa-grid-full">
      {transitionPage.loading ? (
        <va-loading-indicator
          data-testid="transition-loading"
          message="Please wait while we load the application for you."
          uswds
        />
      ) : (
        <div className="usa-content vads-u-padding--2">
          <h1>Transfer to using a verified account to sign in to VA.gov</h1>
          <div className="va-introtext">
            <p>
              {MHV_TRANSITION_DATE ? (
                <>
                  Starting on <strong>{MHV_TRANSITION_DATE}</strong>,{' '}
                </>
              ) : (
                <>Soon </>
              )}
              you’ll no longer be able to use your My HealtheVet username and
              password to sign in to VA.gov. You’ll need to use a verified{' '}
              <strong>Login.gov</strong> or <strong>ID.me</strong> account that
              meets our new, stronger security requirements. Read this page to
              learn how to transfer to a free, verified account now.
            </p>
          </div>
          <TransitionAccountSteps
            data-testid="can-transition"
            canTransition={transitionPage.canTransition}
          />
          <section>
            <h2>
              Questions you may have about transferring to a verified account
            </h2>
            <div>
              <h3>
                Should I create a Login.gov or ID.me account to sign in to
                VA.gov?
              </h3>
              <p>Both Login.gov and ID.me offer these benefits:</p>
              <ul>
                <li>
                  Access to all your VA benefits, services, and information in a
                  single, secure account,
                </li>
                <li>
                  A secure sign-in option that protects your privacy and
                  complies with the latest federal security standards
                </li>
              </ul>
              <p>
                Here’s the difference between these 2 accounts:
                <br />
                Login.gov is an account created, maintained, and secured by the
                U.S. government. It encrypts your stored information at 2
                levels. Encryption translates your data into code that only you
                can access as the account holder. This means only you can access
                and change your information.
                <br />
                ID.me is an account created, maintained, and secured by a
                trusted technology partner. It uses bank-grade encryption to
                keep your personal information safe. It gives you control over
                which services can share your information.
              </p>
            </div>
            <div>
              <h3>When do I need to start using a verified account?</h3>
              <p>
                You need to start using a verified account by{' '}
                {MHV_TRANSITION_DATE}. After this date, you’ll no longer be able
                to use your My HealtheVet username and password to sign in to My
                HealtheVet or VA.gov.
              </p>
            </div>
            <div>
              <h3>Why do I need to start using a verified account?</h3>
              <p>
                We have new, stronger security requirements to help keep your
                personal information safe. These requirements come from the
                National Institute of Standards and Technology (NIST). With
                these requirements, everyone must verify their identity to
                access any information about their U.S. government benefits
                online.
              </p>
              <p>Here’s what this means for you:</p>
              <ul>
                <li>
                  When you create your new account, the account provider will
                  verify your identity. They’ll ask you for personal information
                  (like a photo ID) to make sure you’re you and not someone
                  pretending to be you. This helps us keep your personal
                  information safe.
                </li>
                <li>
                  Each time you sign in with a verified account, you’ll need to
                  provide your password plus a second way to verify you’re you
                  (like a one-time code or an authentication app). This helps us
                  make sure that it’s you trying to access your account—and not
                  a hacker.
                </li>
              </ul>
              <a
                href="/resources/verifying-your-identity-on-vagov/"
                className="vads-u-display--block"
              >
                Get answers to more questions about verifying your identity
              </a>
              <a
                href="https://www.youtube.com/watch?v=t85bt7Pmlvg"
                className="vads-u-display--block"
                rel="noopener noreferrer"
                target="_blank"
              >
                Play our video on multifactor authentication (YouTube)
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
