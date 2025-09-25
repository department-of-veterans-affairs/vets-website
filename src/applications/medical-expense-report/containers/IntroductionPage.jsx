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
        <h4>Here are some examples of expenses you may include:</h4>
        <ul>
          {exampleExpenses.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <h4>Here’s what you’ll need to apply:</h4>
        <ul>
          <li>Veteran Social Security number or VA file number</li>
        </ul>
        <h4>You’ll also need this medical expense information:</h4>
        <ul>
          <li>The date of each of each expense</li>
          <li>The amount you paid for each expense</li>
          <li>The name of the provider</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. The time it takes to
          complete the application varies. It depends on what supporting
          documents you’re required to submit. We’ll let you know what
          supporting documents are required for you as you fill out the
          application.
        </p>
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
      <p>
        Use our online tool to report medical or dental expenses that you have
        paid for yourself or for a family member living in your household. These
        must be expenses you weren’t reimbursed for and don’t expect to be
        reimbursed for.
      </p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for medical expense.
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
