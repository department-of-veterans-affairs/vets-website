// src/applications/toe/containers/IntroductionPage.jsx

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import IntroductionLogin from '../components/IntroductionLogin';

import { getAppData } from '../selectors';

export const IntroductionPageV1 = () => {
  return (
    // === original content unchanged ===
    <div>
      <h1>Apply to use transferred education benefits</h1>
      <h2 className="vads-u-font-size--h3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-top--2p5">
        Equal to VA Form 22-1990e (Application for Family Member to Use
        Transferred Benefits)
      </h2>

      <p className="vads-u-margin-top--4">
        <strong>Note:</strong> This application is only for{' '}
        <strong>Transfer of Entitlement for Post-9/11 GI Bill</strong> (Chapter
        33) education benefits.
      </p>

      <h2 className="vads-u-font-size--h3">
        Follow these steps to get started
      </h2>

      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
            <p>
              In order to receive this benefit, you must be a spouse or child of
              a sponsor who has transferred a benefit to you.
            </p>
            <p>
              If this isn’t the right benefit for you,{' '}
              <a href="https://www.va.gov/education/eligibility/">
                learn more about other education benefits
              </a>
              .
            </p>
          </li>
          <li className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Gather your information</h3>
            <p>
              <strong>Here’s what you’ll need to apply</strong>:
            </p>
            <ul>
              <li>Your sponsor’s military service history</li>
              <li>Your current address and contact information</li>
              <li>Your bank account direct deposit information</li>
            </ul>
            <p className="vads-u-margin-bottom--0">
              <strong>Note</strong>: If you aren’t legally an adult (at least 18
              years old), your parent or guardian must sign your application.
            </p>
          </li>
          <li className="process-step list-three">
            <h3 className="vads-u-font-size--h4">Start your application</h3>
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>

            <va-additional-info trigger="What happens after I apply?">
              <p>
                After you apply, you may get an automatic decision. If we
                approve or deny your application, you’ll be able to download
                your decision letter right away. We’ll also mail you a copy of
                your decision letter.
              </p>
              <br />
              <p className="vads-u-margin-bottom--0">
                <strong>Note</strong>: In some cases, we may need more time to
                make a decision. If you don’t get an automatic decision right
                after you apply, you’ll receive a decision letter in the mail in
                about 30 days. We’ll contact you if we need more information.
              </p>
            </va-additional-info>
          </li>
        </ol>
      </div>
    </div>
  );
};

export const IntroductionPageV2 = () => {
  return (
    <div>
      <h1>Apply to use transferred education benefits</h1>
      <h2 className="vads-u-font-size--h3">
        Equal to VA Form 22-1990e (Application for Family Member to Use
        Transferred Benefits)
      </h2>

      <p>Use VA Form 22-1990e if both of these are true for you:</p>
      <ul>
        <li>You’re the dependent of a Veteran or service member</li>
        <li>
          The Veteran or service member has already transferred Post-9/11 GI
          Bill benefits to you
        </li>
      </ul>

      <p>
        <strong>Note:</strong> If you use our online tool to apply, be sure
        you’re signed in as a family member to your own Login.gov or ID.me
        account to complete this application. We can’t process your application
        if the Veteran or service member signs in to their account and submits
        the application for you.
      </p>

      <va-alert
        close-btn-aria-label="Close notification"
        status="warning"
        visible
      >
        <div>
          If you are a Veteran or service member claiming a benefit based on
          your own service, this may not be the right benefit for you.{' '}
          <a
            target="_blank"
            href="https://www.va.gov/education/other-va-education-benefits"
            rel="noreferrer"
          >
            Learn more about other education benefits
          </a>
        </div>
      </va-alert>

      <h2 className="vads-u-font-size--h3">
        Follow these steps to get started
      </h2>

      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
            <p>
              You must be a spouse or child of a sponsor who has transferred a
              benefit to you in order to receive this benefit.
            </p>
            <p>
              If this isn’t the right benefit for you,{' '}
              <a href="https://www.va.gov/education/other-va-education-benefits/">
                learn more about other education benefits
              </a>
              .
            </p>
          </li>
          <li className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Gather your information</h3>
            <p>
              <strong>Here’s what you’ll need to apply:</strong>
            </p>
            <ul>
              <li>
                Your sponsor’s transferred GI Bill benefits. Make sure your
                sponsor has transferred GI bill benefits before starting this
                application. Your sponsor can{' '}
                <a href="https://milconnect.dmdc.osd.mil/milconnect/">
                  update this information on the DoD milConnect website
                </a>
                .
              </li>
              <li>Your current address and contact information</li>
              <li>Bank account direct deposit information</li>
            </ul>
          </li>
          <li className="process-step list-three">
            <h3 className="vads-u-font-size--h4">Start your application</h3>
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>

            <va-additional-info trigger="What happens after I apply?">
              <p>
                After you apply, you may get an automatic decision. If we
                approve your application, you’ll be able to download your
                Certificate of Eligibility (or award letter) right away. If we
                deny your application, you can download your denial letter.
                We’ll also mail you a copy of your decision letter.
              </p>
              <br />
              <p className="vads-u-margin-bottom--0">
                <strong>Note:</strong> In some cases, we may need more time to
                make a decision. If you don’t get an automatic decision right
                after you apply, you’ll receive a decision letter in the mail in
                about 30 days. We’ll contact you if we need more information.
              </p>
            </va-additional-info>
          </li>
        </ol>
      </div>
    </div>
  );
};

export const IntroductionPageV3 = ({ mebParentGuardianStep }) => {
  return (
    <div>
      <h1 className="vads-u-margin-bottom--1">
        Apply to use transferred education benefits
      </h1>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4  vads-u-font-size--h3">
        Equal to VA Form 22-1990e (Application for Family Member to Use
        Transferred Benefits)
      </p>

      <p>
        Use VA Form 22-1990e if you want to apply for education benefits for the
        first time or make changes to an existing benefit.
      </p>

      <p>
        <strong>
          For first time applicants, use VA Form 22-1990e if both of these
          descriptions are true for you:
        </strong>
      </p>
      <ul>
        <li>
          You’re the dependent of a Veteran or service member{' '}
          <strong>and</strong>
        </li>
        <li>
          The Veteran or service member has already transferred their Post-9/11
          GI Bill benefits
        </li>
      </ul>

      <p>
        <strong>
          If you have applied for education benefits before, use VA Form
          22-1990e to:
        </strong>
      </p>
      <ul>
        {mebParentGuardianStep ? (
          <>
            <li>
              Make updates to your current benefit and get an updated
              Certificate of Eligibility (COE)
            </li>
            <li>
              Apply to switch your existing education benefit and get a new COE
            </li>
            <li>
              Apply for transferred benefits from a different Veteran or service
              member than you’ve used in the past
            </li>
          </>
        ) : (
          <>
            <li>
              Update your current benefit and get an updated Certificate of
              Eligibility (COE)
            </li>
            <li>Switch your existing education benefit and get a new COE</li>
            <li>
              Apply for transferred benefits from a different sponsor than
              you’ve used in the past
            </li>
          </>
        )}
      </ul>

      <p className="vads-u-margin-bottom--0">
        {mebParentGuardianStep ? (
          <>
            <strong>Note:</strong> If you are over the age of 18 and use our
            online tool to apply, be sure you’re signed in as a family member to
            your own Login.gov or ID.me account to complete this application. We
            can’t process your application if the Veteran or service member
            signs in to their account and submits the application for you.
          </>
        ) : (
          <>
            <strong>Note:</strong> If you use our online tool to apply, be sure
            you’re signed in as a family member to your own Login.gov or ID.me
            account to complete this application. We can’t process your
            application if the Veteran or service member signs in to their
            account and submits the application for you.
          </>
        )}
      </p>

      <div className="vads-u-margin-top--4 vads-u-margin-bottom--4">
        <va-alert status="warning" visible>
          <h2
            className="vads-u-margin-top--0 vads-u-margin-bottom--0"
            slot="headline"
          >
            If you’re a Veteran or service member claiming a benefit based on
            your own service, this may not be the right benefit for you.
          </h2>
          <div className="vads-u-margin-top--1">
            <a
              href="https://www.va.gov/education/other-va-education-benefits"
              rel="noreferrer"
              target="_blank"
            >
              Learn more about other education benefits
            </a>
          </div>
        </va-alert>
      </div>

      <h2 className="vads-u-margin-top--0">
        Follow these steps to get started:
      </h2>
      <div className="vads-u-margin-left--3">
        <va-process-list>
          <va-process-list-item header="Check your eligibility">
            <p>
              <strong>
                You must be a spouse or child of a sponsor who has transferred a
                benefit to you
              </strong>{' '}
              in order to receive this benefit.
            </p>
            {mebParentGuardianStep && (
              <p>
                <strong>Note:</strong> If the dependent is under the age of 18,
                a parent/guardian/custodian may complete the application on the
                dependent’s behalf. Alternatively, the dependent may
                authenticate through ID.me and complete the application
                independently.
              </p>
            )}
            <p>
              If this isn’t the right benefit for you,{' '}
              <a
                href="https://www.va.gov/education/other-va-education-benefits/"
                rel="noreferrer"
                target="_blank"
              >
                learn more about other education benefits
              </a>
              .
            </p>
          </va-process-list-item>
          <va-process-list-item header="Gather your information">
            <p>
              <strong>Here’s what you’ll need to apply:</strong>
            </p>
            <ul>
              <li>
                <strong>Your sponsor’s transferred GI Bill benefits.</strong>{' '}
                Make sure your sponsor has transferred GI Bill benefits before
                starting this application. Your sponsor can{' '}
                <a
                  href="https://milconnect.dmdc.osd.mil/milconnect/"
                  rel="noreferrer"
                  target="_blank"
                >
                  update this information on the DoD milConnect website
                </a>
                .
              </li>
              <li>Your current address and contact information</li>
              <li>Bank account direct deposit information</li>
            </ul>
            <p>
              {mebParentGuardianStep ? (
                <>
                  <strong>Note:</strong> If you aren’t legally an adult (at
                  least 18 years of age), you’ll need your parent or guardian’s
                  address and contact information. Your parent or guardian must
                  also sign your application.
                </>
              ) : (
                <>
                  <strong>Note:</strong> If you aren’t an adult (at least 18
                  years old), your parent or guardian must sign your
                  application.
                </>
              )}
            </p>
          </va-process-list-item>
          <va-process-list-item header="Start your application">
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>

            <va-additional-info trigger="What happens after I apply?">
              <p>
                After you apply, you may get an automatic decision. If we
                approve your application, you’ll be able to download your
                Certificate of Eligibility (or award letter) right away. If we
                deny your application, you can download your denial letter.
                We’ll also mail you a copy of your decision letter.
              </p>
              <p>
                <strong>Note:</strong> In some cases, we may need more time to
                make a decision. If you don’t get an automatic decision right
                after you apply, you’ll receive a decision letter in the mail in
                about 30 days. And we’ll contact you if we need more
                information.
              </p>
            </va-additional-info>
          </va-process-list-item>
        </va-process-list>
      </div>
    </div>
  );
};

export const PageVersion = ({
  meb1995Reroute,
  showMeb54901990eTextUpdate,
  mebParentGuardianStep,
}) => {
  if (meb1995Reroute) {
    return <IntroductionPageV3 mebParentGuardianStep={mebParentGuardianStep} />;
  }

  if (showMeb54901990eTextUpdate) {
    return <IntroductionPageV2 />;
  }

  return <IntroductionPageV1 />;
};

export const IntroductionPage = ({
  route,
  meb1995Reroute,
  showMeb54901990eTextUpdate,
  mebParentGuardianStep,
  user,
}) => {
  return (
    <div className="schemaform-intro">
      <PageVersion
        meb1995Reroute={meb1995Reroute}
        showMeb54901990eTextUpdate={showMeb54901990eTextUpdate}
        mebParentGuardianStep={mebParentGuardianStep}
      />

      <IntroductionLogin route={route} />

      <div
        className={`omb-info--container vads-u-padding--0 vads-u-margin-top--${
          user?.login?.currentlyLoggedIn ? '4' : '2p5'
        } vads-u-margin-bottom--2`}
      >
        <va-omb-info
          res-burden="15"
          omb-number="2900-0154"
          exp-date="03/31/2026"
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  ...getIntroState(state),
  ...getAppData(state),
  isPersonalInfoFetchFailed: state.data.isPersonalInfoFetchFailed || false,
  meb1995Reroute: state?.featureToggles[featureFlagNames.meb1995Reroute],
  mebParentGuardianStep:
    state?.featureToggles[featureFlagNames.mebParentGuardianStep],
  showMeb1990EMaintenanceAlert:
    state?.featureToggles[featureFlagNames.showMeb1990EZMaintenanceAlert],
  showMeb54901990eTextUpdate:
    state?.featureToggles[featureFlagNames.showMeb54901990eTextUpdate],
});

export default connect(mapStateToProps)(IntroductionPage);

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }).isRequired,
  meb1995Reroute: PropTypes.bool,
  mebParentGuardianStep: PropTypes.bool,
  showMeb54901990eTextUpdate: PropTypes.bool,
  user: PropTypes.object,
};

IntroductionPageV3.propTypes = {
  mebParentGuardianStep: PropTypes.bool,
};

PageVersion.propTypes = {
  meb1995Reroute: PropTypes.bool,
  mebParentGuardianStep: PropTypes.bool,
  showMeb54901990eTextUpdate: PropTypes.bool,
};
