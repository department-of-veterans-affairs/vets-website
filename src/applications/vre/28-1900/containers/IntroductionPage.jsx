import React, { useEffect } from 'react';
import Scroll from 'react-scroll';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { CHAPTER_31_ROOT_URL, WIZARD_STATUS } from '../constants';
import recordEvent from 'platform/monitoring/record-event';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo(getScrollOptions());
};

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for Veteran Readiness and Employment" />
      <p>
        Equal to VA Form 21-1900 (28-1900 Veteran Readiness and Employment).
      </p>
      <SaveInProgressIntro
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        startText="Start the Application"
      >
        Please complete the 21-1900 form to apply for Vocational Rehabilitation.
      </SaveInProgressIntro>
      <h4>
        Follow the steps below to apply for Veteran Readiness and Employment.
      </h4>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h5>Prepare</h5>
            <h6>To fill out this application, you’ll need your:</h6>
            <ul>
              <li>Social Security number (required)</li>
              <li>Your VA file number (if you know it)</li>
              <li>
                An address, phone number, and email where we can contact you.
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
            <p>Complete this Veteran Readiness and Employment form.</p>
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
              If you’re eligible for Veteran Readiness and Employment benefits,
              we’ll schedule a meeting for you with a Vocational Rehabilitation
              Counselor (VRC). The counselor will work with you to create a
              personalized rehabilitation plan that outlines what VR&E services
              you can get.
            </p>
          </li>
        </ol>
        <p>
          If you’re not sure this is the right form, you can{' '}
          <a
            href={`${CHAPTER_31_ROOT_URL}`}
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
        startText="Start the Application"
      />
      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <OMBInfo resBurden={30} ombNumber="21-1900" expDate="12/31/2021" />
      </div>
    </div>
  );
};

export default IntroductionPage;
