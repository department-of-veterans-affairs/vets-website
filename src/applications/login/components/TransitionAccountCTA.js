import React from 'react';
import PropTypes from 'prop-types';
import { ACCOUNT_TRANSITION } from '../constants';

export default function TransitionAccountCTA({ canTransition }) {
  const {
    headline,
    signUpIDme,
    signUpLoginGov,
    startTransition,
    dismiss,
  } = ACCOUNT_TRANSITION;

  return (
    <va-featured-content>
      <h3 slot="headline">
        {canTransition ? headline.enabled : headline.disabled}
      </h3>
      <div>
        <ul data-testid="ul-container">
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
          <button
            type="button"
            onClick={canTransition ? startTransition : signUpLoginGov}
          >
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
