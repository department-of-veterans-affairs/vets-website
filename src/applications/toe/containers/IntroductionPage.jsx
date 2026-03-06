// src/applications/toe/containers/IntroductionPage.jsx

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import IntroductionLogin from '../components/IntroductionLogin';

import { getAppData } from '../selectors';

export const IntroductionPageContent = ({ mebBlockUnder18 }) => {
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
        {mebBlockUnder18 ? (
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
        {mebBlockUnder18 ? (
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
            {mebBlockUnder18 && (
              <p>
                <b>Note:</b> If you are <b>under the age of 18</b> and applying
                for benefits for yourself, you must complete and submit a signed
                paper application through{' '}
                <va-link
                  href="https://www.va.gov/contact-us/ask-va/introduction"
                  text="Ask VA"
                />
                . A parent, guardian, or custodian must complete the application
                on your behalf and sign the application before submission.
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
              <li>Your bank account direct deposit information</li>
            </ul>
            {!mebBlockUnder18 && (
              <p>
                <strong>Note:</strong> If you aren’t an adult (at least 18 years
                old), your parent or guardian must sign your application.
              </p>
            )}
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

export const IntroductionPage = ({ route, mebBlockUnder18, user }) => {
  return (
    <div className="schemaform-intro">
      <IntroductionPageContent mebBlockUnder18={mebBlockUnder18} />

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
  mebBlockUnder18: PropTypes.bool,
  user: PropTypes.object,
};

IntroductionPageContent.propTypes = {
  mebBlockUnder18: PropTypes.bool,
};
