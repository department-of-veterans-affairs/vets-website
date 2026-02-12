import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-2680-house-bound-status-secondary/constants';

const OMB_RES_BURDEN = 30;
const OMB_NUMBER = '2900-0721';
const OMB_EXP_DATE = '02/28/2026';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>You should fill out this examination if you are:</p>
        <ul>
          <li>a Medical Doctor (MD) </li>
          <li>a Doctor of Osteopathic (DO) medicine </li>
          <li>a physician assistant </li>
          <li>or advanced practice registered nurse </li>
        </ul>
        <p>and</p>
        <ul>
          <li>
            your patient informed you that you to complete the medical provider
            portion of 21-2680
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>You’ll need this information about the person applying:</p>
        <ul>
          <li>Their name</li>
          <li>Their date of birth</li>
        </ul>
        <p>We will ask questions about the patient related to:</p>
        <ul>
          <li>
            their relevant disabilities and how those disabilities impact their
            Activities for Daily Living (ADLs)
          </li>
          <li>whether they are blind </li>
          <li>whether they are bedridden</li>
          <li>
            details about how well they
            <ul>
              <li>ambulate</li>
              <li>where they go</li>
              <li>and what they are able to do during a typical day</li>
            </ul>
          </li>
          <li>
            whether they experience
            <ul>
              <li>physical or mental impairment</li>
              <li>loss of coordination </li>
              <li>
                or enfeeblement that require assistance with daily living.
              </li>
            </ul>
          </li>
        </ul>
        <p>
          If the person applying is currently in nursing home, we’ll need to
          know the name of the nursing home.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. It should take about
          30 minutes.
        </p>
        <p>
          The purpose of this examination is for you to provide medical findings
          related to whether the claimant is housebound or in need of the
          regular aid and attendance of another person. Please provide as much
          description as needed for each question as this will assist us in
          making our decision.
        </p>
        <p>
          Once you have completed this form, signed it, and submitted, we will
          notify you and your patient of the submission. After we have processed
          the claim, your patient will be notified of our decision.
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
        Use this form to complete the medical provider portion of the
        application for Aid and Attendance or Housebound allowance benefits.
        Based on your examination and diagnosis, we’ll determine if your patient
        is eligible for additional monthly compensation or pension benefits.
      </p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply:
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
