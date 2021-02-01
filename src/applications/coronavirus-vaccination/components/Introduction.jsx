import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import * as userNavActions from 'platform/site-wide/user-nav/actions';
import * as userSelectors from 'platform/user/selectors';

function Introduction({
  authButtonDisabled = false,
  isLoggedIn,
  toggleLoginModal,
}) {
  return (
    <>
      <h1>Stay informed about getting a COVID-19 vaccine at VA</h1>
      <div className="va-introtext">
        <p>
          We’re working to provide COVID-19 vaccines to Veterans as quickly and
          safely as we can, based on CDC guidelines and available supply. Sign
          up below to stay informed about when you can get a COVID-19 vaccine at
          VA.
        </p>
      </div>
      <DowntimeNotification
        appTitle="Covid 19 Vaccination Information"
        dependencies={[externalServices.vetextVaccine]}
      >
        <p>
          We’ll send you updates on how we’re providing vaccines across the
          country—and when you can get a vaccine if you want one. We’ll also
          offer information and answers to your questions along the way.
        </p>
        {authButtonDisabled ? (
          <p>
            <Link
              className="usa-button"
              to="/form"
              onClick={() => {
                recordEvent({
                  event: 'cta-button-click',
                  'button-type': 'default',
                  'button-click-label': 'Continue',
                  'button-background-color': '#0071bb',
                });
              }}
            >
              Continue
            </Link>
          </p>
        ) : (
          <>
            {isLoggedIn ? (
              <Link className="usa-button" to="/form">
                Sign up to stay informed
              </Link>
            ) : (
              <>
                <p>
                  <strong>Note:</strong> You can sign up without signing in to
                  VA.gov. But when you sign in first, we can fill in some of
                  your information for you.
                </p>
                <p>
                  <button
                    type="button"
                    onClick={() => {
                      toggleLoginModal(true, 'coronavirus-vaccination');
                      recordEvent({
                        event: 'cta-button-click',
                        'button-type': 'default',
                        'button-click-label': 'Sign in',
                        'button-background-color': '#0071bb',
                      });
                    }}
                    className="usa-button"
                  >
                    Sign in
                  </button>
                  <Link
                    className="usa-button usa-button-secondary"
                    to="/form"
                    onClick={() => {
                      recordEvent({
                        event: 'cta-button-click',
                        'button-type': 'secondary',
                        'button-click-label': 'Continue without signing in',
                        'button-background-color': 'transparent',
                      });
                    }}
                  >
                    Continue without signing in
                  </Link>
                </p>
              </>
            )}
          </>
        )}
        <AlertBox
          status={ALERT_TYPE.INFO}
          content={
            <>
              <p>
                <strong>What you should know about signing up</strong>
                We continue to contact Veterans as they become eligible to get a
                COVID-19 vaccine. We base eligibility on VA and{' '}
                <a
                  href="https://www.cdc.gov/vaccines/covid-19/phased-implementation.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  CDC COVID-19 risk criteria
                </a>
                . Within each risk group, we may first contact Veterans who sign
                up here and tell us that they plan to get a vaccine. But we’ll
                still contact every eligible Veteran
              </p>
            </>
          }
        />
      </DowntimeNotification>
    </>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: userSelectors.isLoggedIn(state),
    authButtonDisabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.covidVaccineUpdatesDisableAuth
    ],
  };
};

const mapDispatchToProps = {
  toggleLoginModal: userNavActions.toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Introduction);
export { Introduction };
