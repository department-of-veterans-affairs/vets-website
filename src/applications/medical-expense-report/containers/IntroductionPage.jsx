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
  { id: 1, name: 'Hospital and office visits' },
  { id: 2, name: 'Nursing homes and home health services' },
  { id: 3, name: 'Medical supplies' },
  { id: 4, name: 'Prescription and over-the-counter drugs' },
  { id: 5, name: 'Medical insurance premiums and Medicare deductions' },
  { id: 6, name: 'Mileage and transportation for medical purposes' },
];

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="What to know before you fill out this form">
        {/* <ul>
          {exampleExpenses.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul> */}
        <ul className="vads-u-padding-top--1p5">
          <li>
            You can report expenses that you’ve paid for yourself or for a
            dependent family member living in your household, such as a spouse,
            child, grandchild, or parent.
          </li>
          <li>
            Don’t report expenses that were already reimbursed or will be
            reimbursed.
          </li>
          <li>
            You don’t need to provide receipts for your expenses. But you should
            keep your receipts for your own records.
          </li>
        </ul>
        <va-additional-info trigger="Why you should keep your receipts">
          <p>
            We recommend keeping all receipts or other documentation of payments
            for at least 3 years after receiving a decision on your medical
            expense claim. If we need to verify your expenses later and these
            records aren’t available, your benefits may be retroactively reduced
            or discontinued.
          </p>
        </va-additional-info>
      </va-process-list-item>
      <va-process-list-item header="Types of expenses you may report">
        <ul className="vads-u-padding-top--1p5">
          {exampleExpenses?.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
        <va-additional-info trigger="Additional documents we may ask for">
          <p>
            If you’re reporting in-home care, nursing home, or other care
            facility expenses, you may need to submit proof for these expenses
            with your form.
          </p>
          <p>
            You may also need to submit 1 or more of these VA forms signed by a
            provider:
          </p>
          <ul>
            <li>
              Worksheet for a Residential Care, Adult Daycare, or Similar
              Facility from VA Form 21P-8416
              <span className="vads-u-display--block">
                <va-link
                  href="https://www.va.gov/find-forms/about-form-21p-8416/"
                  text="Get VA Form 21P-8416 to download"
                />
              </span>
            </li>
            <li>
              Worksheet for In-Home Attendant from VA Form 21P-8416
              <span className="vads-u-display--block">
                <va-link
                  href="https://www.va.gov/find-forms/about-form-21p-8416/"
                  text="Get VA Form 21P-8416 to download"
                />
              </span>
            </li>
            <li>
              Request for Nursing Home Information in Connection with Claim for
              Aid and Attendance (VA Form 21-0779)
              <span className="vads-u-display--block">
                <va-link
                  href="https://www.va.gov/find-forms/about-form-21-0779/"
                  text="Get VA Form 21-0779 to download"
                />
              </span>
            </li>
            <li>
              Examination for Housebound Status or Permanent Need for Regular
              Aid and Attendance form (VA Form 21-2680)
              <span className="vads-u-display--block">
                <va-link
                  href="https://www.va.gov/find-forms/about-form-21-2680/"
                  text="Get VA Form 21-2680 to download"
                />
              </span>
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
        Use this form to report medical or dental expenses. These expenses are
        deducted from your reported income to determine if you should receive a
        higher benefit rate.
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
          startText="Report your medical expenses"
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
