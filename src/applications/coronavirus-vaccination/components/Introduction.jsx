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

import * as userNavActions from 'platform/site-wide/user-nav/actions';
import * as userSelectors from 'platform/user/selectors';
import FormFooter from 'platform/forms/components/FormFooter';
import {
  ContactRules,
  ProvideSSNAndDOB,
  WhatIfIDontSignUp,
  WhyContact,
} from './VerbiageHelper';

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
        <va-alert visible status="info">
          <span className="vads-u-font-size--h3">
            <strong>What you should know about signing up</strong>
          </span>
          <p>
            By sharing your plans for getting a vaccine, you help us better plan
            our efforts.
          </p>

          <span className="vads-u-font-size--h4">
            <strong>
              If you're enrolled in VA health care or currently receiving care
              through VA
            </strong>
          </span>
          <p>
            Sign up to tell us if you plan to get a COVID-19 vaccine. Many VA
            health facilities are now offering vaccines to all enrolled
            Veterans. We may first contact Veterans who sign up here and tell us
            they plan to get a vaccine. But we’ll still contact every Veteran
            who's receiving care through VA to ask if they want one.
          </p>

          <span className="vads-u-font-size--h4">
            <strong>If you're not enrolled, but need a COVID-19 vaccine</strong>
          </span>
          <p>
            Sign up to tell us if you want to get a vaccine at VA. If you’re a
            Veteran, spouse, caregiver, or CHAMPVA recipient, we'll contact you
            when we have a vaccine for you. At this time, we don't know when
            that will be.
          </p>
          <p>
            <strong>Note:</strong> Your employer, pharmacy, health care
            provider’s office, or local public health officials may offer you a
            COVID-19 vaccine. We encourage you to take the first opportunity you
            have to get a vaccine at the most convenient location for you. The
            Centers for Disease Control and Prevention’s (CDC) online vaccine
            finder tool can help you find COVID-19 vaccines near you.
          </p>
          <span>
            <a
              href="https://www.cdc.gov/vaccines/covid-19/reporting/vaccinefinder/about.html"
              aria-label="Find COVID-19 vaccines near you with the CDC’s vaccine finder"
            >
              Find COVID-19 vaccines near you with the CDC’s vaccine finder
            </a>
          </span>
        </va-alert>
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
