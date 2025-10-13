import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../utils/constants';

const OMB_RES_BURDEN = 40;
const OMB_NUMBER = '2900-0004';
const OMB_EXP_DATE = 'TBD';

const IntroductionText = () => {
  return (
    <p>
      Use this online tool to submit evidence along with your claim, using the
      Fully Developed Claim (FDC) program to get a decision on your claim
      faster. You can use this form if you’re a surviving spouse or child of a
      Veteran who has died, or if you are applying for VA benefits and the money
      that we owe the Veteran wasn’t paid prior to their death.
    </p>
  );
};

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>
          Check your eligibility requirements before you apply. If you think you
          may be eligible, but you’re not sure, we encourage you to apply.
        </p>
        <a href="/family-and-caregiver-benefits/survivor-compensation/">
          Find out if you’re eligible for D.I.C., Survivors Pension, or Accrued
          Benefits
        </a>
      </va-process-list-item>
      <va-process-list-item header="Check your claim">
        <p>This tool is where you upload evidence to support your claim for:</p>
        <ul>
          <li>Survivors Pension</li>
          <li>Dependency Indemnity Compensation (D.I.C.)</li>
          <li>D.I.C. under 38 U.S.C. 1151</li>
          <li>D.I.C. re-evaluation based on PL 117-16 (PACT ACT)</li>
          <li>
            Increased Survivor Benefits Based on Need for Special Monthly
            Pension or Special Monthly D.I.C.
          </li>
          <li>Accrued Benefits</li>
          <li>Benefits Based on a Veteran’s Seriously Disabled Child</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <h4>Here’s what you’ll need to apply:</h4>
        <ul>
          <li>Veteran Social Security number or VA file number</li>
          <li>Veteran military history</li>
          <li>Veteran work history</li>
          <li>
            Veteran marital history (and if you’re married, your spouse’s
            marital history)
          </li>
          <li>Information about any dependent children</li>
        </ul>
        <h4>If applying for a Survivor’s Pension, you’ll need:</h4>
        <ul>
          <li>
            The Veteran’s DD214 or other separation documents,{' '}
            <strong>and</strong>
          </li>
          <li>The Veteran’s death certificate, showing cause of death</li>
        </ul>
        <h4>If you’re a surviving spouse, you‘ll need:</h4>
        <ul>
          <li>
            Your marriage certificate or other evidence showing you were married
            to the Veteran for at least 1 year immediately before their death,
            <strong>or</strong>
          </li>
          <li>
            Evidence that you and the Veteran had a child that was born either
            before or during your marriage, <strong>or</strong>
          </li>
          <li>
            Evidence that you were married before a fixed date based on certain
            wartime periods
          </li>
        </ul>
        <h4>If applying for D.I.C. you’ll need:</h4>
        <ul>
          <li>
            Any service treatment and personnel records held by the Veteran’s
            National Guard or Reserve unit
          </li>
          <li>
            Any of the Veteran’s relevant private medical treatment records
          </li>
          <li>
            Any of the Veteran’s treatment records held at a federal facility,
            like a VA medical center, that support your claim
          </li>
          <li>
            Any evidence from a layperson (someone who’s not a trained
            professional) of chronic (long-lasting) symptoms of the disability
          </li>
        </ul>
        <h4>If applying for Accrued Benefits, you’ll need:</h4>
        <ul>
          <li>
            Any service treatment and personnel records held by the Veteran’s
            National Guard or Reserve unit
          </li>
          <li>
            Any of the Veteran’s relevant private medical treatment records
          </li>
          <li>
            Any of the Veteran’s treatment records held at a federal facility,
            like a VA medical center, that support your claim
          </li>
          <li>
            Any evidence from a layperson (someone who’s not a trained
            professional) of chronic (long-lasting) symptoms of the disability
          </li>
        </ul>
        <va-additional-info trigger="Other documents we may ask for">
          <p>
            Based on your answers, you may need to submit other documents with
            your application. These documents may include VA forms or evidence
            for answers to specific questions.
          </p>
          <p>
            If you are claiming in-home care, nursing home, or other care
            facility expenses, you may need to submit proof for these claimed
            expenses and other documents with your application. You only need to
            submit proof for these three expense types. For all other types, you
            only need to fill out the relevant fields in the form.
          </p>
          <p>
            In addition, if you are claiming any of these expense types, you may
            need to attach one or more of these VA forms that have been signed
            by a provider:
          </p>
          <ul>
            <li>
              Residential Care, Adult Daycare, or a Similar Facility worksheet
            </li>
            <li>In-Home Attendant Expenses worksheet</li>
            <li>
              Request for Nursing Home Information in Connection with Claim for
              Aid and Attendance (VA Form 21-0779)
            </li>
            <li>
              Examination for Housebound Status or Permanent Need for Regular
              Aid and Attendance form (VA Form 21-2680)
            </li>
          </ul>
        </va-additional-info>
      </va-process-list-item>
      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. The time it takes to
          complete the application varies. It depends on what supporting
          documents you’re required to submit. We’ll let you know what
          supporting documents are required for you as you fill out the
          application.
        </p>
        <va-additional-info trigger="What happens after you apply">
          <p>
            We’ll process your application and send you a letter in the mail
            with our decision.
          </p>
          <p>
            We may request more information from you to make a decision about
            your medical expense reimbursement. If we request more information,
            you’ll need to respond within 30 days. If you don’t, we may decide
            your expenses with the evidence that’s available to us.
          </p>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { route } = props;
  const { formConfig, pageList } = route;
  const showVerifyIdentify = userLoggedIn && !userIdVerified;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <IntroductionText />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow these steps to get started:
      </h2>
      <ProcessList />
      {showVerifyIdentify ? (
        <div>{/* add verify identity alert if applicable */}</div>
      ) : (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the application"
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}
      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
