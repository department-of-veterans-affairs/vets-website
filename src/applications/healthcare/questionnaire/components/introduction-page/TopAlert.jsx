import React from 'react';

export default function TopAlert({ toggleLoginModal }) {
  return (
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">
          Please sign in to start your questionnaire
        </h3>
        <div className="usa-alert-text">
          <p>When you’re signed in to your VA.gov account:</p>
          <ul>
            <li>
              We can prefill part of your questionnaire based on your account
              details.
            </li>
            <li>
              You can save your questionnaire in progress, and come back later
              to finish filling it out. You’ll have until [time period] before
              your upcoming appointment to submit it.
            </li>
          </ul>
        </div>
        <button
          className="va-button top-login-button"
          onClick={() => {
            toggleLoginModal(true, 'cta-form');
          }}
        >
          Sign in to start the questionnaire
        </button>
      </div>
    </div>
  );
}
