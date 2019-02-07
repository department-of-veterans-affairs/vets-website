/* eslint-disable camelcase */
import React from 'react';
import siteName from '../brand-consolidation/site-name';
import SubmitSignInForm from '../brand-consolidation/components/SubmitSignInForm';
import CallVBACenter from '../brand-consolidation/components/CallVBACenter';

export const systemDownMessage = (
  <div className="row" id="systemDownMessage">
    <div className="small-12 columns">
      <div className="react-container">
        <h3>
          Sorry, our system is temporarily down while we fix a few things.
          Please try again later.
        </h3>
        <a href="/" className="usa-button-primary">
          Go Back to {siteName}
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
          Please{' '}
          <CallVBACenter>
            call <a href="tel:855-574-7286">1-855-574-7286</a>, TTY:{' '}
            <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday,
            8:00 a.m. &#8211; 8:00 p.m. (ET).
          </CallVBACenter>
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
              You need to log in to My HealtheVet and accept their terms and
              conditions.
            </li>
          </ol>
          <p>
            If none of these apply to you, please{' '}
            <SubmitSignInForm>
              call the {siteName}
              Help Desk at 1-855-574-7286, TTY: 1-800-877-8339. We're here
              Monday – Friday, 8:00 a.m. – 8:00 p.m. (ET).
            </SubmitSignInForm>
          </p>
        </div>
      </div>
    </div>
  </div>
);
