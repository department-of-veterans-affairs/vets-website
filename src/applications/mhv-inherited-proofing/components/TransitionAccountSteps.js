import React from 'react';
import PropTypes from 'prop-types';
import { ACCOUNT_TRANSITION } from '../constants';

export default function TransitionAccountSteps({ canTransition }) {
  const {
    headline,
    subheader,
    signUpIDme,
    signUpLoginGov,
    startTransition,
  } = ACCOUNT_TRANSITION;

  return (
    <div>
      <h2>{canTransition ? headline.eligible : headline.ineligible}</h2>
      <p data-testid="subheader">
        {canTransition ? subheader.eligible : subheader.ineligible}
      </p>
      {canTransition ? (
        <div>
          <p>You’ll need access to these items to complete the process:</p>
          <ul>
            <li>
              Your email account, <strong>and</strong>
            </li>
            <li>Your phone to transfer</li>
          </ul>
          <button
            data-testid="transition-btn"
            type="button"
            onClick={startTransition}
            className="usa-button button-primary"
          >
            Transfer my account to Login.gov
          </button>
          <p>
            <strong>Note:</strong> You can also choose to use a verified{' '}
            <strong>ID.me</strong> account instead. Read the next section to
            learn more.
          </p>
        </div>
      ) : (
        <>
          <div>
            <h3>Create a Login.gov account</h3>
            <p>
              Here’s what you’ll need to verify your identity with Login.gov:
            </p>
            <ul>
              <li>
                Your driver’s license or non-driver’s license state-issued ID,
                <strong>and</strong>
              </li>
              <li>
                Your Social Security Number, <strong>and</strong>
              </li>
              <li>A phone number on a phone plan that’s in your name</li>
            </ul>
            <button type="button" onClick={signUpLoginGov}>
              Create a Login.gov account
            </button>
          </div>
          <div>
            <h3>Create an ID.me account</h3>
            <p>Here’s what you’ll need to verify your identity with ID.me:</p>
            <ul>
              <li>
                A smartphone (or a landline or mobile phone and a computer with
                an internet connection),
                <strong>and</strong>
              </li>
              <li>
                Your Social Security Number, <strong>and</strong>
              </li>
              <li>
                Proof of your identity. You can use your driver’s license or
                passport as proof. Or, you can answer questions based on private
                and public data (like your credit report) to prove you’re you.
              </li>
            </ul>
            <button type="button" onClick={signUpIDme}>
              Create an ID.me account
            </button>
          </div>
        </>
      )}
    </div>
  );
}

TransitionAccountSteps.propTypes = {
  canTransition: PropTypes.bool,
};
