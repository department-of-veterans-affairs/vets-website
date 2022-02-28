import React from 'react';
import PropTypes from 'prop-types';
import { signup } from 'platform/user/authentication/utilities';
import { CSP_IDS } from 'platform/user/authentication/constants';

function dismiss() {
  // TODO: trackEvent for dismissing
  window.location = '/';
}

const TRANSITION = {
  headline: {
    enabled: `In order to transition your account we will securely share the following personal information with Login.gov`,
    disabled: `Here are the following items you need to create an account with one our trusted partners: Login.gov or ID.me`,
  },
  signUpLoginGov() {
    signup({ csp: CSP_IDS.LOGIN_GOV });
  },
  signUpIDme() {
    signup({ csp: CSP_IDS.ID_ME });
  },
};

export default function TransitionAccountCTA({ canTransition }) {
  const { headline, signUpIDme, signUpLoginGov } = TRANSITION;

  return (
    <va-featured-content>
      <h3 slot="headline">
        {canTransition ? headline.enabled : headline.disabled}
      </h3>
      <div>
        <ul>
          {canTransition ? (
            <>
              <li>
                Name, <strong>and</strong>
              </li>
              <li>
                Date of birth, <strong>and</strong>
              </li>
              <li>Social Security Number</li>
            </>
          ) : (
            <>
              <li>
                You have a state-issued identification license,{' '}
                <strong>or</strong>
              </li>
              <li>
                You have a passport, <strong>and</strong>
              </li>
              <li>You have a smartphone capable of taking pictures</li>
            </>
          )}
        </ul>
        <div>
          <button type="button" onClick={signUpLoginGov}>
            {canTransition ? `Start transition now` : `Login.gov`}
          </button>
          {!canTransition && (
            <button type="button" onClick={signUpIDme}>
              ID.me
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="usa-button-secondary"
          >
            Dismiss for now
          </button>
        </div>
      </div>
    </va-featured-content>
  );
}

TransitionAccountCTA.propTypes = {
  canTransition: PropTypes.bool,
};
