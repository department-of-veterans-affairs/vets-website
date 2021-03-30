import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import environment from 'platform/utilities/environment';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import * as userNavActions from 'platform/site-wide/user-nav/actions';
import * as userSelectors from 'platform/user/selectors';
import {
  ContactRules,
  ProvideSSNAndDOB,
  WhatIfIDontSignUp,
  WhyContact,
} from './VerbiageHelper';

import FormFooter from 'platform/forms/components/FormFooter';
import GetHelp from './GetHelp';

function Introduction({
  authButtonDisabled = false,
  enhancedEligibilityEnabled,
  isLoggedIn,
  toggleLoginModal,
}) {
  return (
    <>
      <h1>Sign up to get a COVID-19 vaccine at VA</h1>
      <div className="va-introtext">
        <p>
          We’re working to provide COVID-19 vaccines as quickly and safely as we
          can. We base our vaccine plans on CDC guidelines, federal law, and
          available supply. Sign up to tell us you’d like to get a COVID-19
          vaccine at VA.
        </p>
      </div>
      <DowntimeNotification
        appTitle="Covid 19 Vaccination Information"
        dependencies={[externalServices.vetextVaccine]}
      >
        <p>
          If you’re eligible, we’ll contact you when we have a vaccine for you.
          We’ll also offer updates and answers to your questions along the way.
        </p>
        {authButtonDisabled ? (
          <p>
            <a
              className="usa-button"
              href={
                enhancedEligibilityEnabled
                  ? encodeURI(
                      `${
                        environment.BASE_URL
                      }/health-care/covid-19-vaccine/sign-up`,
                    )
                  : '/health-care/covid-19-vaccine/stay-informed/form'
              }
            >
              Sign up now
            </a>
          </p>
        ) : (
          <>
            {isLoggedIn ? (
              <Link className="usa-button" to="/form">
                Sign up now
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
              </p>
              <ul>
                <li>
                  <strong>
                    If you're a Veteran currently receiving care through VA,
                  </strong>{' '}
                  we'll ask about your vaccine plans when you sign up. We
                  continue to contact Veterans as they become eligible to get a
                  COVID-19 vaccine. We base eligibility on VA and{' '}
                  <a
                    href="https://www.cdc.gov/vaccines/covid-19/phased-implementation.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="CDC COVID-19 risk criteria phased implemention (Open in a new window)"
                  >
                    CDC COVID-19 risk criteria
                  </a>
                  . Within each risk group, we may first contact Veterans who
                  sign up here and tell us that they plan to get a vaccine. But
                  we’ll still contact every eligible Veteran in each risk group
                  to ask if they want to get a vaccine.
                </li>
                <li>
                  <strong>
                    If you're a Veteran who isn’t receiving care through VA or a
                    spouse, caregiver, or CHAMPVA recipient,
                  </strong>{' '}
                  sign up to tell us if you want to get a vaccine through VA. If
                  you're eligible, we'll contact you when we have a vaccine
                  available for you. At this time, we don't know when that will
                  be.
                </li>
              </ul>
              <p>
                By sharing your plans for getting a vaccine, you help us better
                plan our efforts. This helps us do the most good with our
                limited vaccine supply.
              </p>
              <p>
                <strong>Note:</strong> Your employer, pharmacy, health care
                provider’s office, or local public health officials may offer
                you a COVID-19 vaccine. We encourage you to take the first
                opportunity you have to get a vaccine at the most convenient
                location for you.
              </p>
              <p>
                The Centers for Disease Control and Prevention’s (CDC) online
                vaccine finder tool can help you find COVID-19 vaccines near
                you.
              </p>
              <span>
                <a
                  href="https://www.cdc.gov/vaccines/covid-19/reporting/vaccinefinder/about.html"
                  aria-label="Find COVID-19 vaccines near you with the CDC’s vaccine finder"
                >
                  Find COVID-19 vaccines near you with the CDC’s vaccine finder
                </a>
              </span>
            </>
          }
        />
      </DowntimeNotification>

      <h2>More about getting a COVID-19 vaccine at VA</h2>
      <va-accordion class="vads-u-margin-top--1">
        <va-accordion-item
          level="3"
          header="Why would VA contact Veterans who are planning to get a vaccine first?"
        >
          <WhyContact />
        </va-accordion-item>
        <va-accordion-item
          level="3"
          header="If I don’t sign up or tell VA I plan to get a vaccine, will VA still contact me when I can get a vaccine?"
        >
          <WhatIfIDontSignUp />
        </va-accordion-item>
        <va-accordion-item
          level="3"
          header="Do I have to provide my Social Security number and date of birth?"
        >
          <ProvideSSNAndDOB />
        </va-accordion-item>
        <va-accordion-item
          level="3"
          header="How will VA contact me when I can get a COVID-19 vaccine?"
        >
          <ContactRules />
        </va-accordion-item>
      </va-accordion>
      <div className="vads-u-margin-top--1">
        <FormFooter formConfig={{ getHelp: GetHelp }} />
      </div>
    </>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: userSelectors.isLoggedIn(state),
    authButtonDisabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.covidVaccineUpdatesDisableAuth
    ],
    enhancedEligibilityEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.covidVaccineUpdatesEnableExpandedEligibility
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
