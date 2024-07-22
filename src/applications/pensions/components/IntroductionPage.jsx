import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { FormReactivationAlert } from './FormAlerts';

const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const showUpdatedIntroduction = useToggleValue(
    TOGGLE_NAMES.pensionIntroductionUpdate,
  );

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
    },
    [props],
  );

  return showUpdatedIntroduction ? (
    <article className="schemaform-intro vads-u-margin-bottom--6">
      <FormTitle
        title="Apply for Veterans Pension benefits"
        subTitle="Application for Veterans Pension (VA Form 21P-527EZ)"
      />
      <p>
        Use our online tool to fill out and submit your application for Veterans
        Pension benefits. If you’re a wartime Veteran and you’re at least 65
        years old, or if you have a permanent and total disability, you may be
        eligible. Your income and net worth need to be within certain limits.
      </p>
      <p>
        <strong>Note:</strong> A Veterans Pension is different from a military
        retirement pension.
      </p>
      <va-link href="" text="Learn about the different types of pensions" />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow these steps to get started
      </h2>
      <va-process-list uswds>
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
          <h4 className="vads-u-margiin-y--1">
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
            <p>
              Based on your answers, you may need to submit supporting documents
              and additional evidence.
            </p>
          </va-additional-info>
          <p>
            We’ll tell you if you need to submit any of these supporting
            documents:
          </p>
          <ul>
            <li>
              Examination for Housebound Status or Permanent Need for Regular
              Aid and Attendance (
              <va-link
                href="https://www.va.gov/find-forms/about-form-21-2680/"
                text="VA Form 21-2680"
              />
              )
            </li>
            <li>
              Request for Nursing Home Information in Connection with Claim for
              Aid and Attendance (
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
                text="VA Form 21-2674"
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
            And we’ll tell you the additional evidence you’ll need to submit
            depending your situation.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Start your application">
          <p>
            We’ll take you through each step of the process. It should take
            about 30 minutes.
          </p>
          <va-additional-info
            trigger="What happens after you apply"
            disable-border
          >
            <p>
              We’ll process your application and send you a letter in the mail
              with our decision.
            </p>
            <p>
              We may request more information from you to make a decision about
              your pension claim. If we request more information, you’ll need to
              respond within 30 days. If you don’t, we may decide your pension
              claim with the evidence that’s available to us.
            </p>
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>
      <SaveInProgressIntro
        prefillEnabled={formConfig.prefillEnabled}
        pageList={pageList}
        downtime={route.formConfig.downtime}
        startText="Start the pension application"
        retentionPeriod="one year"
        retentionPeriodStart="when you start"
        continueMsg={<FormReactivationAlert />}
      />
      <va-omb-info
        res-burden={30}
        omb-number="2900-0002"
        exp-date="08/31/2025"
      />
    </article>
  ) : (
    <div className="schemaform-intro">
      <FormTitle title="Apply for Veterans Pension benefits" />
      <p>VA Form 21P-527EZ</p>
      <SaveInProgressIntro
        prefillEnabled={formConfig.prefillEnabled}
        pageList={route.pageList}
        downtime={route.formConfig.downtime}
        startText="Start the pension application"
        retentionPeriod="one year"
        retentionPeriodStart="when you start"
        continueMsg={<FormReactivationAlert />}
      />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow these steps to apply for a Veterans Pension
      </h2>
      <va-process-list uswds>
        <va-process-list-item header="Prepare">
          <h4 className="vads-u-margin-y--1">
            To fill out this application, you’ll need this information:
          </h4>
          <ul>
            <li>
              Your Social Security number or VA file number{' '}
              <span className="vads-u-color--secondary-dark">(*Required)</span>
            </li>
            <li>
              Your military history{' '}
              <span className="vads-u-color--secondary-dark">(*Required)</span>
            </li>
            <li>
              Financial information about you and your dependents{' '}
              <span className="vads-u-color--secondary-dark">(*Required)</span>
            </li>
            <li>Your marital status and prior marital history</li>
            <li>Information about your spouse’s prior marriage</li>
            <li>Information about your dependent children</li>
            <li>Your employment history</li>
          </ul>
          <h4>
            If you have special circumstances for your medical care, you may
            also need these additional forms:
          </h4>
          <ul>
            <li>
              <strong>Statement of Medical Care:</strong> Care Worksheets at the
              end of this pension benefits form that must be completed by an
              administrator or licensed medical professional
            </li>
            <li>
              Claim for Special Monthly Pension (
              <a
                href="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                VA Form 21-2680
              </a>
              )
            </li>
            <li>
              Claim for Medicare Nursing Home and/por $90.00 Rate Reduction
              Request (
              <a
                href="https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                VA Form 21-0779
              </a>
              )
            </li>
            <li>
              Claim for Fiduciary Assistance (
              <a
                href="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                VA Form 21-2680
              </a>
              )
            </li>
          </ul>
        </va-process-list-item>
        <va-process-list-item header="Apply">
          <p>Complete and submit the pension benefits application form.</p>
        </va-process-list-item>
      </va-process-list>
      <SaveInProgressIntro
        buttonOnly
        prefillEnabled={formConfig.prefillEnabled}
        pageList={pageList}
        startText="Start the pension application"
        downtime={route.formConfig.downtime}
      >
        Please complete the 21-527EZ form to apply for pension benefits.
      </SaveInProgressIntro>
      <h3>What if I need help filling out my application?</h3>
      <p>
        An accredited representative, like a Veterans Service Officer (VSO), can
        help you fill out your claim.{' '}
        <va-link
          href="https://www.va.gov/disability/get-help-filing-claim/"
          text="Get help filing your claim"
        />
      </p>
      <va-omb-info
        res-burden={30}
        omb-number="2900-0002"
        exp-date="08/31/2025"
      />
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      title: PropTypes.string,
      subTitle: PropTypes.string,
    }),
    pageList: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default IntroductionPage;
