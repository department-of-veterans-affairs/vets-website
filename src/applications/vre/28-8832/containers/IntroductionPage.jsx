import React, { useEffect } from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import recordEvent from 'platform/monitoring/record-event';
import {
  CHAPTER_31_ROOT_URL,
  WIZARD_STATUS,
  PCPG_ROOT_URL,
} from '../constants';

const IntroductionPage = props => {
  // focus on element
  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for Personalized Career Planning and Guidance" />
      <p>
        Equal to VA Form 28-8832 (Education/Vocational Counseling Application).
      </p>
      <SaveInProgressIntro
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        downtime={props.route.formConfig.downtime}
        startText="Apply for career planning and guidance"
      >
        Please complete the 28-8832 form to apply for Planning and career
        guidance.
      </SaveInProgressIntro>
      <h4>Follow the steps below to apply for career planning and guidance.</h4>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h5>Prepare</h5>
            <h6>To fill out this application, you’ll need your:</h6>
            <ul>
              <li>Social Security number</li>
              <li>Date of birth</li>
              <li>
                If you’re a dependent, you’ll need the name and Social Security
                number of the Veteran or service member who sponsors you.
              </li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, with a Veterans Service Organization
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </li>
          <li className="process-step list-two">
            <h5>Apply</h5>
            <p>Complete this career planning and guidance form.</p>
            <p>
              After submitting your application, you’ll get a confirmation
              message. It will include details about your next steps. You can
              print this for your records.
            </p>
          </li>
          <li className="process-step list-three">
            <h5>VA Review</h5>
            <p>
              We process applications in the order we receive them. We may
              contact you if we have questions or need more information.
            </p>
          </li>
          <li className="process-step list-four">
            <h5>Decision</h5>
            <p>
              If you’re eligible for career planning and guidance benefits,
              we’ll invite you to an orientation session at your nearest VA
              regional office.
            </p>
          </li>
        </ol>
        <p>
          If you’re not sure this is the right form, you can{' '}
          <a
            href={`${PCPG_ROOT_URL}/introduction`}
            onClick={() => {
              recordEvent({
                event: 'howToWizard-start-over',
              });
              sessionStorage.removeItem(WIZARD_STATUS);
            }}
          >
            go back and answer the questions again.
          </a>
        </p>
      </div>
      <SaveInProgressIntro
        buttonOnly
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        downtime={props.route.formConfig.downtime}
        startText="Apply for career planning and guidance"
      />
      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <OMBInfo resBurden={30} ombNumber="2900-0265" expDate="12/31/2021" />
      </div>
      <AlertBox
        content={
          <>
            <h5 className="vads-u-font-size--h3 vads-u-margin-top--0">
              Do you have a service-connected disability or pre-discharge
              disability rating?
            </h5>
            <p>
              If you have a service-connected or pre-discharge disability
              rating, you may be eligible for Chapter 31 Veteran Readiness and
              Employment (VR&E) benefits. With this program, you can get
              employment support and services to help you find a job and live as
              independently as possible.
            </p>
            <a href={CHAPTER_31_ROOT_URL}>
              Learn more about Chapter 31 eligibility
            </a>
          </>
        }
        status={ALERT_TYPE.INFO}
        backgroundOnly
      />
    </div>
  );
};

export default IntroductionPage;
