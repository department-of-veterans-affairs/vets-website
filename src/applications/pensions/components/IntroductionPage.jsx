import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { selectProfile } from 'platform/user/selectors';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';

import { FormReactivationAlert } from './FormAlerts';
import DisabilityRatingAlert from './DisabilityRatingAlert';

const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pbbFormsRequireLoa3 = useToggleValue(TOGGLE_NAMES.pbbFormsRequireLoa3);
  const pensionRatingAlertLoggingEnabled = useToggleValue(
    TOGGLE_NAMES.pensionRatingAlertLoggingEnabled,
  );

  // LOA3 Verified?
  const isVerified = useSelector(
    state => selectProfile(state)?.verified || false,
  );
  const hasInProgressForm = useSelector(state =>
    selectProfile(state)?.savedForms?.some(
      form => form.form === route.formConfig.formId,
    ),
  );

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Apply for Veterans Pension benefits"
        subTitle="Application for Veterans Pension (VA Form 21P-527EZ)"
      />
      {pensionRatingAlertLoggingEnabled && <DisabilityRatingAlert />}
      <p className="va-introtext">
        Use our online tool to fill out and submit your application for Veterans
        Pension benefits. If you’re a wartime Veteran and you’re at least 65
        years old, or if you have a permanent and total disability, you may be
        eligible. Your income and net worth need to be within certain limits.
      </p>
      <p>
        <strong>Note:</strong> A Veterans Pension is different from a military
        retirement pension.
      </p>
      <va-link
        href="https://www.va.gov/resources/how-are-pension-benefits-and-disability-compensation-different/"
        text="Learn about the differences between pension benefits and disability compensation"
      />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow these steps to get started
      </h2>
      <va-process-list>
        <va-process-list-item header="Check your eligibility">
          <p className="vads-u-margin-y--1">
            Check our eligibility requirements before you apply. If you think
            you may be eligible, but you’re not sure, we encourage you to apply.
          </p>
          <va-link
            href="https://www.va.gov/pension/eligibility/"
            text="Find out if you’re eligible for Veterans Pension benefits"
          />
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <h4 className="vads-u-margin-y--1">
            Here’s what you’ll need to apply:
          </h4>
          <ul>
            <li>Your Social Security number or VA file number</li>
            <li>Your military history</li>
            <li>Your work history</li>
            <li>
              Your marital history (and if you’re married, your spouse’s marital
              history)
            </li>
            <li>Information about your dependents</li>
          </ul>
          <h4>You’ll also need this financial information:</h4>
          <ul>
            <li>Your household’s gross monthly income</li>
            <li>The value of your household’s assets</li>
            <li>Your unreimbursed medical expenses</li>
          </ul>
          <va-additional-info
            trigger="Other information we may ask for"
            disable-border
          >
            <div>
              <p>
                Based on your answers, you may need to submit other documents
                with your application. These documents may include VA forms or
                evidence for answers to specific questions.
              </p>
              <p>
                We’ll tell you if you need to complete any of these VA forms:
              </p>
              <ul>
                <li>
                  Examination for Housebound Status or Permanent Need for
                  Regular Aid and Attendance (
                  <va-link
                    href="https://www.va.gov/find-forms/about-form-21-2680/"
                    text="VA Form 21-2680"
                  />
                  )
                </li>
                <li>
                  Request for Nursing Home Information in Connection with Claim
                  for Aid and Attendance (
                  <va-link
                    href="https://www.va.gov/find-forms/about-form-21-0779/"
                    text="VA Form 21-20779"
                  />
                  )
                </li>
                <li>
                  Request for Approval of School Attendance (
                  <va-link
                    href="https://www.va.gov/find-forms/about-form-21-674/"
                    text="VA Form 21-674"
                  />
                  )
                </li>
                <li>
                  Income and Asset Statement in Support of Claim for Pension or
                  Parents’ Dependency and Indemnity Compensation (
                  <va-link
                    href="https://www.va.gov/find-forms/about-form-21p-0969/"
                    text="VA Form 21P-0969"
                  />
                  )
                </li>
              </ul>
              <p>
                And we’ll tell you about any additional evidence you need to
                submit depending on your situation.
              </p>
            </div>
          </va-additional-info>
        </va-process-list-item>
        <va-process-list-item header="Start your application">
          <p>
            When you start this application, we automatically record your intent
            to file for pension benefits.
          </p>
          <p>
            We use your intent to file date to help set a start date (or
            effective date) for your benefits. If we approve your claim, you may
            be able to get retroactive payments for the time between your intent
            to file date and the date we approve your claim.
          </p>
          <va-link
            external="true"
            href="/resources/your-intent-to-file-a-va-claim/"
            text="Learn more about intent to file"
          />
          <p>
            We’ll take you through each step of the process. The time it takes
            to complete the application varies. It depends on what supporting
            documents you’re required to submit. We’ll let you know what
            supporting documents are required for you as you fill out the
            application.
          </p>
          <va-additional-info
            trigger="What happens after you apply"
            disable-border
          >
            <div>
              <p>
                We’ll process your application and send you a letter in the mail
                with our decision.
              </p>
              <p>
                We may request more information from you to make a decision
                about your pension claim. If we request more information, you’ll
                need to respond within 30 days. If you don’t, we may decide your
                pension claim with the evidence that’s available to us.
              </p>
            </div>
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>

      {/* Only show the verify alert if all of the following are true:
        - the feature toggle is enabled
        - the user is NOT LOA3 verified
        - the user does not have an in-progress form (we want LOA1 users to be
          able to continue their form)
      */}
      {pbbFormsRequireLoa3 && !isVerified && !hasInProgressForm ? (
        <>
          <VerifyAlert />
          <p>
            If you don’t want to verify your identity right now, you can still
            download and complete the PDF version of this application.
          </p>
          <p className="vads-u-margin-bottom--4">
            <va-link
              href="http://www.vba.va.gov/pubs/forms/VBA-21P-527EZ-ARE.pdf"
              download
              filetype="PDF"
              text="Get VA Form 21P-527EZ form to download"
              pages="17"
            />
          </p>
        </>
      ) : (
        <SaveInProgressIntro
          hideUnauthedStartLink={pbbFormsRequireLoa3}
          formConfig={formConfig}
          prefillEnabled={formConfig.prefillEnabled}
          pageList={pageList}
          downtime={route.formConfig.downtime}
          startText="Start the pension application"
          retentionPeriod="one year"
        >
          <FormReactivationAlert />
        </SaveInProgressIntro>
      )}
      <div className="vads-u-margin-top--2">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0002"
          exp-date="08/31/2025"
        />
      </div>
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      title: PropTypes.string,
      subTitle: PropTypes.string,
      downtime: PropTypes.object,
    }),
    pageList: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default IntroductionPage;
