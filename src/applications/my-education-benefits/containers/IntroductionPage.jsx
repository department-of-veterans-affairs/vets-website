/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VA_FORM_IDS } from 'platform/forms/constants';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';

import HowToApplyPost911GiBill from '../components/HowToApplyPost911GiBill';
import { fetchUser } from '../selectors/userDispatch';
import { CLAIMANT_INFO_ENDPOINT } from '../actions';

export const IntroductionPage = ({ user, route }) => {
  const SaveInProgressComponent = (
    <SaveInProgressIntro
      testActionLink
      user={user}
      prefillEnabled={route.formConfig.prefillEnabled}
      messages={route.formConfig.savedFormMessages}
      pageList={route.pageList}
      hideUnauthedStartLink
      startText="Start your application"
    />
  );

  const handleRedirect = async response => {
    if (!response?.data?.attributes?.claimant) {
      window.location.href =
        '/education/apply-for-education-benefits/application/1990/';
    }
    return response;
  };

  useEffect(
    () => {
      const checkIfClaimantExists = async () =>
        apiRequest(CLAIMANT_INFO_ENDPOINT)
          .then(response => handleRedirect(response))
          .catch(err => err);

      focusElement('.va-nav-breadcrumbs-list');
      if (user.login.currentlyLoggedIn) {
        checkIfClaimantExists().then(res => res);
      }
    },
    [user.login.currentlyLoggedIn],
  );

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for VA education benefits" />
      <p>Equal to VA Form 22-1990 (Application for VA Education Benefits)</p>
      <HowToApplyPost911GiBill />
      <h3>Follow these steps to get started</h3>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h4>Check your eligibility</h4>
            <p>
              Make sure you meet our eligibility requirements before you apply.
            </p>
            <AdditionalInfo triggerText="What are the Post-9/11 GI Bill eligibility requirements?">
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
            </AdditionalInfo>
          </li>
          <li className="process-step list-two">
            <h4>Gather your information</h4>
            <p>
              <strong>Here’s what you’ll need to apply</strong>:
            </p>
            <ul>
              <li>Knowledge of your military service history</li>
              <li>Your current address and contact information</li>
            </ul>
          </li>
          <li className="process-step list-three">
            <h4>Start your application</h4>
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>
            <AdditionalInfo triggerText="What happens after I apply?">
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
            </AdditionalInfo>
          </li>
        </ol>
      </div>

      {user?.login?.currentlyLoggedIn &&
        !user.profile.savedForms.some(
          p => p.form === VA_FORM_IDS.FORM_22_1990EZ,
        ) && <h3>Begin your application for education benefits</h3>}

      {SaveInProgressComponent}

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
  user: fetchUser(state),
});

export default connect(mapStateToProps)(IntroductionPage);
