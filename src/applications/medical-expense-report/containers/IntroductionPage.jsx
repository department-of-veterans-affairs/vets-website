import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../utils/constants';

const OMB_RES_BURDEN = 30;
const OMB_NUMBER = '2900-0161';
const OMB_EXP_DATE = '10/31/2026';

const exampleExpenses = [
  { id: 1, name: 'Hospital expenses' },
  { id: 2, name: 'Doctor’s office fees' },
  { id: 3, name: 'Dental fees' },
  { id: 4, name: 'Nursing home costs' },
  { id: 5, name: 'Hearing aid costs' },
  { id: 6, name: 'Home health service expenses' },
  { id: 7, name: 'Prescription/non-prescription drug costs' },
  {
    id: 8,
    name:
      'Expenses related to transportation to a hospital, doctor or other medical facility',
  },
  { id: 9, name: 'Vision care costs' },
  { id: 10, name: 'Medical insurance premiums' },
  { id: 11, name: 'Monthly Medicare deduction' },
];

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check that your expenses qualify">
        <h4 className="vads-u-padding-top--1p5">
          Here are some examples of expenses you may include:
        </h4>
        <ul>
          {exampleExpenses.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <h4 className="vads-u-padding-top--1p5">
          Here’s what you’ll need to apply:
        </h4>
        <ul>
          <li>Veteran Social Security number or VA file number</li>
        </ul>
        <h4>You’ll also need this medical expense information:</h4>
        <ul>
          <li>The date of each of each expense</li>
          <li>The amount you paid for each expense</li>
          <li>The name of the provider</li>
        </ul>
        <va-additional-info trigger="Additional documents we may ask for">
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
              Aid and Attendance (
              <va-link
                href="https://www.va.gov/find-forms/about-form-21-0779/"
                text="VA Form 21-20779"
              />
              )
            </li>
            <li>
              Examination for Housebound Status or Permanent Need for Regular
              Aid and Attendance form (
              <va-link
                href="https://www.va.gov/find-forms/about-form-21-2680/"
                text="VA Form 21-2680"
              />
              )
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
      <p className="va-introtext">
        Use our online tool to report medical or dental expenses that you have
        paid for yourself or for a family member living in your household. These
        must be expenses you weren’t reimbursed for and don’t expect to be
        reimbursed for.
      </p>
      <h2 className="vad-u-margin-top--0">
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
          startText="Start your 21P-8416"
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
