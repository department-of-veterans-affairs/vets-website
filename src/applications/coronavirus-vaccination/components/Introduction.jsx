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
      <h1>COVID-19 vaccines: Stay informed and help us prepare</h1>
      <div className="va-introtext">
        <p>
          We’re working to get COVID-19 vaccines to Veterans as quickly and
          safely as possible based on CDC guidelines and available supply. We
          need your help to prepare. And we want to keep you informed at every
          step.
        </p>
      </div>
      <DowntimeNotification
        appTitle="Covid 19 Vaccination Information"
        dependencies={[externalServices.vetextVaccine]}
      >
        <p>
          Sign up below to help us understand your interest in getting a
          vaccine. We’ll send you updates on how we’re providing vaccines across
          the country—and when you can get your vaccine if you want one. We’ll
          also offer information and answers to your questions along the way.
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
                  When you sign in, we can fill in some of your information for
                  you.
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
                You don’t need to sign up to get a vaccine. And you can change
                your mind about getting a vaccine at any time. We’ll use the
                information you provide to understand your interest and keep you
                informed.
              </p>
              <p>
                <a href="/health-care/covid-19-vaccine/#who-will-get-a-covid-19-vaccin">
                  Learn who will get a COVID-19 vaccine first based on CDC
                  guidelines
                </a>
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
