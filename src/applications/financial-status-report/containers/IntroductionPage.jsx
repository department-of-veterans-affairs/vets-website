import React from 'react';
import formConfig from '../config/form';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  return (
    <div className="schemaform-intro">
      <FormTitle title="Request help for VA debt" />
      <p>Equal to VA Form 5655 (Financial Status Report).</p>
      <SaveInProgressIntro
        startText="Request help for VA debt"
        unauthStartText="Sign in or create an account"
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        verifyRequiredPrefill={props.route.formConfig.verifyRequiredPrefill}
        formConfig={formConfig}
      >
        Please complete the 5655 form to apply for benefits.
      </SaveInProgressIntro>
      <h4>Follow the steps below to apply for benefits.</h4>
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
            <p>Complete this benefits form.</p>
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
        startText="Request help for VA debt"
        unauthStartText="Sign in or create an account"
        prefillEnabled={props.route.formConfig.prefillEnabled}
        formConfig={formConfig}
      />
      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <OMBInfo resBurden={60} ombNumber="2900-0862" expDate="02/28/2022" />
      </div>
    </div>
  );
};

export default IntroductionPage;
