import React, { useEffect, useState } from 'react';
import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import HowToApplyPost911GiBill from '../components/HowToApplyPost911GiBill';
import { connect } from 'react-redux';
import { fetchUser } from '../selectors/userDispatch';

export const IntroductionPage = ({ user, route }) => {
  const fetchEligibility = () =>
    fetch('http://localhost:3000/meb_api/v0/eligibility')
      .then(response => response.json())
      .then(results => results?.data?.veteranIsEligible);

  // Uncomment AFTER API has all chapters in ARRAY

  // .then(results => results?.data?.map(chap => {
  //     if (chap.chapter === 'chapter33') {
  //       return chap.veteranIsEligible;
  //     }
  //   }),
  // );

  const [isEligible] = useState(fetchEligibility);
  const [continueOrRedirect, setCourse] = useState(
    <SaveInProgressIntro
      testActionLink
      user={user}
      prefillEnabled={route.formConfig.prefillEnabled}
      messages={route.formConfig.savedFormMessages}
      pageList={route.pageList}
      hideUnauthedStartLink
      startText="Start the education application"
    >
      Please complete the 22-1990 form to apply for my education benefits.
    </SaveInProgressIntro>,
  );

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
      try {
        isEligible.then(res => {
          if (user.login.currentlyLoggedIn && !res) {
            setCourse(
              <a
                className="vads-c-action-link--green"
                href="/education/apply-for-education-benefits/application/1990/introduction"
              >
                Start the education application
              </a>,
            );
          }
        });
      } catch (err) {
        isEligible.then(r => r);
      }
    },
    [continueOrRedirect, isEligible, user.login.currentlyLoggedIn],
  );

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for VA education benefits" />
      <p>Equal to VA Form 22-1990 (Application for VA Education Benefits)</p>
      <HowToApplyPost911GiBill />
      {continueOrRedirect}
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

      <SaveInProgressIntro
        testActionLink
        buttonOnly
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        pageList={route.pageList}
        hideUnauthedStartLink
        startText="Start the education application"
      />
      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <OMBInfo resBurden={15} ombNumber="2900-0154" expDate="02/28/2023" />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: fetchUser(state),
});

export default connect(mapStateToProps)(IntroductionPage);
