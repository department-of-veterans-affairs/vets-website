import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import HowToApplyPost911GiBill from '../components/HowToApplyPost911GiBill';
import { connect } from 'react-redux';
import { fetchUser } from '../selectors/userDispatch';

import environment from 'platform/utilities/environment';

export const IntroductionPage = ({ user, route }) => {
  const CLAIMANT_URL = `${environment.API_URL}/meb_api/v0/claimant_info`;

  const SaveInProgressComponent = (
    <SaveInProgressIntro
      testActionLink
      user={user}
      prefillEnabled={route.formConfig.prefillEnabled}
      messages={route.formConfig.savedFormMessages}
      pageList={route.pageList}
      hideUnauthedStartLink
      startText="Start the education application"
    />
  );

  const handleRedirect = async response => {
    if (!response.ok && response.status === 404) {
      window.location.href =
        '/education/apply-for-education-benefits/application/1990/';
    }
    return response;
  };

  const checkIfClaimantExists = async () =>
    fetch(CLAIMANT_URL)
      .then(response => handleRedirect(response))
      .catch(err => err);

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
      if (user.login.currentlyLoggedIn) {
        checkIfClaimantExists().then(res => res);
      }
    },
    [user?.login?.currentlyLoggedIn, checkIfClaimantExists],
  );

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for VA education benefits" />
      <p>Equal to VA Form 22-1990 (Application for VA Education Benefits)</p>
      <HowToApplyPost911GiBill />
      {SaveInProgressComponent}
      <h4>Follow the steps below to apply for my education benefits.</h4>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <div>
              <h5>Prepare</h5>
            </div>
            <div>
              <h6>To fill out this application, you’ll need:</h6>
            </div>
            <ul>
              <li>Knowledge of your military service history</li>
              <li>Your current address and contact information</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>
              <br />
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability/get-help-filing-claim/">
                Find an accredited representative
              </a>
              .
            </p>
          </li>
          <li className="process-step list-two">
            <div>
              <h5>Apply</h5>
            </div>
            <p>Complete this education benefits application.</p>
          </li>
          <li className="process-step list-three">
            <div>
              <h5>VA Review</h5>
            </div>
            <p>
              After submitting the application, you may get a decision
              automatically.
            </p>
            <p>
              Sometimes we may need to take a closer look at your application.
              This process will usually take 30 days. We’ll let you know by your
              preferred contact method if we need more information.
            </p>
          </li>
          <li className="process-step list-four">
            <div>
              <h5>Decision</h5>
            </div>
            <p>
              If we’ve approved your application, you’ll get a link to download
              your Certificate of Eligibility (COE), or award letter.
            </p>
            <br />
            <p>
              If your application wasn’t approved, you’ll get a link to download
              your denial letter.
            </p>
            <br />
            <p>We will also send these letters in the mail.</p>
          </li>
        </ol>
      </div>
      {SaveInProgressComponent}
      <div
        className="omb-info--container"
        style={{ marginTop: '1rem', paddingLeft: '0px' }}
      >
        <OMBInfo resBurden={15} ombNumber="2900-0154" expDate="02/28/2023" />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: fetchUser(state),
});

export default connect(mapStateToProps)(IntroductionPage);
