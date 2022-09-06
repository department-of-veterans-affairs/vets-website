/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VA_FORM_IDS } from 'platform/forms/constants';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';

import HowToApplyPost911GiBill from '../components/HowToApplyPost911GiBill';
import { fetchUser } from '../selectors/userDispatch';
import LoadingIndicator from '../components/LoadingIndicator';

export const IntroductionPage = ({ firstName, eligibility, user, route }) => {
  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for VA education benefits" />
      <p>Equal to VA Form 22-1990 (Application for VA Education Benefits)</p>
      <HowToApplyPost911GiBill />
      <h2>Follow these steps to get started</h2>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3>Check your eligibility</h3>
            <p>
              Make sure you meet our eligibility requirements before you apply.
            </p>
            <va-additional-info trigger="What are the Post-9/11 GI Bill eligibility requirements?">
              <p>
                <strong>At least one of these must be true:</strong>
              </p>
              <ul>
                <li>
                  {' '}
                  You served at least 90 days on active duty (either all at once
                  or with breaks in service) on or after September 11, 2001,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  You received a Purple Heart on or after September 11, 2001,
                  and were honorably discharged after any amount of service,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  You served for at least 30 continuous days (all at once,
                  without a break in service) on or after September 11, 2001,
                  and were honorably discharged with a service-connected
                  disability
                </li>
              </ul>
            </va-additional-info>
          </li>
          <li className="process-step list-two">
            <h3>Gather your information</h3>
            <p>
              <strong>Here’s what you’ll need to apply</strong>:
            </p>
            <ul>
              <li>Knowledge of your military service history</li>
              <li>Your current address and contact information</li>
            </ul>
          </li>
          <li className="process-step list-three">
            <h3>Start your application</h3>
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
                <strong>Note</strong>: In some cases, we may need more time to
                make a decision. If you don’t get an automatic decision right
                after you apply, you’ll receive a decision letter in the mail in
                about 30 days. And we’ll contact you if we need more
                information.
              </p>
            </va-additional-info>
          </li>
        </ol>
      </div>

      {user?.login?.currentlyLoggedIn &&
        firstName &&
        eligibility &&
        !user.profile.savedForms.some(
          p => p.form === VA_FORM_IDS.FORM_22_1990EZ,
        ) && <h2>Begin your application for education benefits</h2>}

      {!user.login.currentlyLoggedIn || (firstName && eligibility) ? (
        <SaveInProgressIntro
          testActionLink
          user={user}
          prefillEnabled={route.formConfig.prefillEnabled}
          messages={route.formConfig.savedFormMessages}
          pageList={route.pageList}
          hideUnauthedStartLink
          headingLevel={2}
          startText="Start your application"
        />
      ) : (
        <LoadingIndicator />
      )}

      {!user?.login?.currentlyLoggedIn && (
        <a href="https://www.va.gov/education/apply-for-education-benefits/application/1990/applicant/information">
          Start your application without signing in
        </a>
      )}

      <OMBInfo resBurden={15} ombNumber="2900-0154" expDate="02/28/2023" />
    </div>
  );
};

const mapStateToProps = state => ({
  firstName: state.data?.formData?.data?.attributes?.claimant?.firstName,
  eligibility: state.data?.eligibility,
  user: fetchUser(state),
});

export default connect(mapStateToProps)(IntroductionPage);
