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
import CollapsiblePanel from '@department-of-veterans-affairs/component-library/CollapsiblePanel';
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
  isLoggedIn,
  toggleLoginModal,
}) {
  return (
    <>
      <h1>Stay informed about getting a COVID-19 vaccine at VA</h1>
      <div className="va-introtext">
        <p>
          We’re working to provide COVID-19 vaccines as quickly and safely as we
          can, based on CDC guidelines and available supply. Sign up below to
          stay informed about when you can get a COVID-19 vaccine at VA.
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
                    If you're a Veteran, spouse, or caregiver not receiving care
                    through VA,
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
                <strong>Note:</strong> Your employer, pharmacy, or local public
                health officials may offer you a COVID-19 vaccine. We encourage
                you to take the first opportunity you have to get a vaccine at
                the most convenient location for you.
              </p>
              <span>
                <a
                  href="/health-care/covid-19-vaccine/#who-will-get-a-covid-19-vaccin"
                  aria-label="Learn who will get a COVID-19 vaccine first based on CDC
                  guidelines"
                >
                  Learn who can get a COVID-19 vaccine now based on CDC
                  guidelines
                </a>
              </span>
            </>
          }
        />
      </DowntimeNotification>

      <div className="vads-u-margin-top--1">
        <CollapsiblePanel panelName="Why would VA contact Veterans who are planning to get a vaccine first?">
          <WhyContact />
        </CollapsiblePanel>
        <CollapsiblePanel panelName="If I don’t sign up or tell VA I plan to get a vaccine, will VA still contact me when I can get a vaccine?">
          <WhatIfIDontSignUp />
        </CollapsiblePanel>
        <CollapsiblePanel panelName="Do I have to provide my Social Security number and date of birth?">
          <ProvideSSNAndDOB />
        </CollapsiblePanel>
        <CollapsiblePanel panelName="How will VA contact me when I can get a COVID-19 vaccine?">
          <ContactRules />
        </CollapsiblePanel>
      </div>
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
