import React from 'react';
import { useSelector } from 'react-redux';
import { transitionMHVAccount } from 'platform/user/authentication/selectors';
import { mhvTransitionEnabled } from 'platform/user/selectors';
import TransitionAccountCTA from './TransitionAccountCTA';
import IdentityWizard from './IdentityWizard';

export default function TransitionAccount() {
  // TODO: wait for BE team to add to User model
  const canTransition = useSelector(transitionMHVAccount);
  const transitionEnabled = useSelector(mhvTransitionEnabled);

  return (
    <main className="usa-grid usa-grid-full">
      <section className="usa-content vads-u-padding--2">
        <h1>VA.gov is moving towards a more secure sign-in process</h1>
        <div className="va-introtext">
          <p>
            The My HealtheVet username and password is going away. You must
            transition to using a verified account with one our trusted
            partners. VA.gov will begin a phased account transition beginning
            Month XX, 20XX.
          </p>
        </div>
        <TransitionAccountCTA
          data-testid="can-transition"
          canTransition={Boolean(canTransition && transitionEnabled)}
        />
        {!canTransition && (
          <div data-testid="cant-transition">
            <h2>How do I choose between an ID.me and Login.gov account?</h2>
            <p>
              Just answer a few questions, and we’ll help you get started with
              determining which VA-trusted account that’s right for you.
            </p>
            <IdentityWizard />
          </div>
        )}
        <div>
          <h2>When will I need to transition my account?</h2>
          <p>
            The current timeline for transitioning from you My HealtheVet will
            begin Month XX, 20XX and go through Month XX, 20XX. VA.gov wants to
            give it’s users ample time to transition to using a new secure
            account.
          </p>
        </div>
        <div>
          <h2>Why do I need to transition my account?</h2>
          <p>
            VA.gov will begin a phasing out the My HealtheVet account credential
            starting on Month XX, 20XX. With new security requirements around
            securely signing into government sites, the cybersecurity framework
            provided by the National Institutde of Standards and Technology
            (NIST) requires that VA.gov accounts will be required to prove their
            identity to access services online.
          </p>
        </div>
        <div>
          <h2>
            Where can I find more information about verifying my identity?
          </h2>
          <p>
            You can find more information about{' '}
            <a href="/resources/verifying-your-identity-on-vagov/">
              verifying your identity
            </a>{' '}
            on our VA.gov resources and support page. On this page you learn
            more about which VA-trusted identity partner is right for you,
            common troubleshooting steps, and frequently asked questions
            concerning your identity and VA.gov.
          </p>
        </div>
      </section>
    </main>
  );
}
