/* eslint-disable camelcase */
import React from 'react';
import SubmitSignInForm from './SubmitSignInForm';
import CallVBACenter from './CallVBACenter';

export const systemDownMessage = (
  <div className="row" id="systemDownMessage">
    <div className="small-12 columns">
      <div className="react-container">
        <h3>
          We're sorry. Our system is temporarily down while we fix a few things.
          Please try again later.
        </h3>
        <a href="/" className="usa-button-primary">
          Go back to VA.gov
        </a>
      </div>
    </div>
  </div>
);

export const unableToFindRecordWarning = (
  <div id="recordNotFound">
    <div className="small-12 columns">
      <div className="react-container">
        <h3>We weren't able to find your records.</h3>
        <h4>
          Please <CallVBACenter />
        </h4>
      </div>
    </div>
  </div>
);

export const mhvAccessError = (
  <div id="mhv-access-error">
    <div className="small-12 columns">
      <div className="react-container">
        <h4>We can't give you access to this tool right now.</h4>
        <div>
          <p>This could be for one of a few different reasons:</p>
          <ol>
            <li>
              <strong>Have you never received care at a VA facility?</strong>{' '}
              Only VA patients can use this tool.
            </li>
            <li>
              <strong>
                Do you need a different My HealtheVet account type?
              </strong>{' '}
              You may need a higher level of access to use this tool. Learn
              about the different account types on the{' '}
              <a
                href="https://www.myhealth.va.gov/mhv-portal-web/upgrading-your-my-healthevet-account-through-in-person-or-online-authentication"
                rel="noopener noreferrer"
                target="_blank"
              >
                My HealtheVet website.
              </a>
            </li>
            <li>
              <strong>
                Did you forget to accept My HealtheVet's terms and conditions?
              </strong>{' '}
              You need to sign in to My HealtheVet and accept their terms and
              conditions.
            </li>
          </ol>
          <p>
            If none of these apply to you, please <SubmitSignInForm />
          </p>
        </div>
      </div>
    </div>
  </div>
);
