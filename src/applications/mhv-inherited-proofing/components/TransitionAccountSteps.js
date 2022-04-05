import React from 'react';
import PropTypes from 'prop-types';
import IDmeSVG from 'platform/user/authentication/components/IDMeSVG';
import LoginGovSVG from 'platform/user/authentication/components/LoginGovSVG';

import { ACCOUNT_TRANSITION } from '../constants';

export default function TransitionAccountSteps({ canTransition }) {
  const { header, subheader } = canTransition
    ? ACCOUNT_TRANSITION.eligible
    : ACCOUNT_TRANSITION.ineligible;

  return (
    <div>
      <h2>{header}</h2>
      <p data-testid="subheader">{subheader}</p>
      {canTransition ? (
        <div>
          <p>You'll need access to these items to complete the process:</p>
          <ul>
            <li>
              Your email account, <strong>and</strong>
            </li>
            <li>Your phone to transfer</li>
          </ul>
          <button onClick={() => ({})}>Transfer my account to Login.gov</button>
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
            <button
              type="button"
              onClick={() => ({})}
              className="usa-button logingov-button vads-u-margin-y--1p5 vads-u-padding-y--2"
              aria-label="Create a Login.gov account"
            >
              Create a <LoginGovSVG /> account
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
            <button type="button" onClick={() => ({})}>
              Create an <IDmeSVG /> account
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
