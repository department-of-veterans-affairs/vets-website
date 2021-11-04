import React from 'react';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  const pageList = props.route.pageList.filter(f => f.path !== '/validate');
  // console.log({ pageList, props: props.route.pageList });
  return (
    <div className="schemaform-intro">
      <FormTitle title="pre-check-in" />
      <p>Equal to VA Form PRE-CHECK-IN (pre-check-in).</p>
      <SaveInProgressIntro
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
      >
        Please complete the PRE-CHECK-IN form to apply for pre-check-in.
      </SaveInProgressIntro>
      <h4>Follow the steps below to apply for pre-check-in.</h4>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h5>Prepare</h5>
            <h6>To fill out this application, you’ll need your:</h6>
            <ul>
              <li>Social Security number (required)</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </li>
          <li className="process-step list-two">
            <h5>Apply</h5>
            <p>Complete this pre-check-in form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li className="process-step list-three">
            <h5>VA Review</h5>
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </li>
          <li className="process-step list-four">
            <h5>Decision</h5>
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </li>
        </ol>
      </div>
      <SaveInProgressIntro
        buttonOnly
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        startText="Start the Application"
      />
      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <OMBInfo resBurden={30} ombNumber="" expDate="12/31/2022" />
      </div>
    </div>
  );
};

export default IntroductionPage;
