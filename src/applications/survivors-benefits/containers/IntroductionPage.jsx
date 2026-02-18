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
const OMB_EXP_DATE = '08/31/2028';

const IntroductionText = () => {
  return (
    <p className="va-introtext">
      Use this application if you’re the surviving spouse or child of a Veteran
      and want to apply for survivors benefits. You can also submit evidence
      with your application to get a faster decision.
    </p>
  );
};

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p className="vads-u-margin-top--2">
          Check your eligibility requirements before you apply. If you think you
          may be eligible, but you’re not sure, we encourage you to apply.
        </p>
        <p>
          <a href="/family-and-caregiver-benefits/survivor-compensation/dependency-indemnity-compensation/">
            Find out if you’re eligible for VA Dependency and Indemnity
            Compensation (DIC)
          </a>
        </p>
        <p>
          <a href="/family-and-caregiver-benefits/survivor-compensation/survivors-pension/">
            Find out if you’re eligible for Survivors Pension
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Determine which benefits to apply for">
        <p className="vads-u-margin-top--2">
          You can apply for these benefits with this application:
        </p>
        <ul>
          <li>Dependency Indemnity Compensation (DIC)</li>
          <li>Survivors Pension</li>
          <li>
            Increased benefits based on Aid and Attendance or being housebound
          </li>
          <li>Accrued Benefits</li>
          <li>Pension benefits for a disabled child</li>
        </ul>
        <p>
          You can also upload evidence (supporting documents) to support your
          application.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p className="vads-u-margin-top--2">
          Depending on which benefits you’re applying for, you’ll need to
          provide certain information and evidence.
        </p>
        <p>
          <a href="/resources/evidence-to-support-va-pension-dic-or-accrued-benefits-claims/">
            Learn more about evidence to support VA pension, DIC, or accrued
            benefits claims
          </a>
        </p>
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
            your claim for survivors benefits. If we request more information,
            you’ll need to respond within 30 days. If you don’t, we may decide
            your claim with the evidence that’s available to us.
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
      <h2 className="vad-u-margin-top--0">
        Follow these steps to get started:
      </h2>
      <ProcessList />
      {showVerifyIdentify ? (
        <div>{/* add verify identity alert if applicable */}</div>
      ) : (
        <SaveInProgressIntro
          returnUrl="/veteran"
          headingLevel={2}
          hideUnauthedStartLink
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Apply for survivors benefits"
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
