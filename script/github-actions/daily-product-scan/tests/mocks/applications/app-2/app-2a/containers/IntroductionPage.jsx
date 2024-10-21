import { Link } from 'react-router';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import React, { useEffect } from 'react';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS } from '../constants';

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
    document.title =
      'Apply for Veteran Readiness and Employment Benefits | Veteran Affairs';
  }, []);

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for Veteran Readiness and Employment with VA Form 28-1900" />
      <p>
        Equal to VA Form 28-1900 (Vocational Rehabilitation for Claimants With
        Service-Connected Disabilities)
      </p>
      <SaveInProgressIntro
        hideUnauthedStartLink
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        startText="Apply for Veteran Readiness and Employment"
        headingLevel="2"
      >
        Please complete the 28-1900 form to apply for Vocational Rehabilitation.
      </SaveInProgressIntro>
      <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
        Follow the steps below to apply for Veteran Readiness and Employment
        benefits.
      </h2>
      <p id="vre-orientation-return">
        If you’re not sure this is the right form, you can{' '}
        <Link
          aria-describedby="vre-orientation-return"
          to="/start"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-start-over',
            });
            sessionStorage.removeItem(WIZARD_STATUS);
          }}
        >
          go back and answer the questions again.
        </Link>
      </p>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3>Prepare</h3>
            <h4>When you apply, be sure to have these on hand:</h4>
            <ul>
              <li>Social Security number</li>
              <li>Your VA file number (if you know it)</li>
              <li>
                An address, phone number, and email where we can contact you.
              </li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative with a Veterans Service Organization
              (VSO) can help you fill out your application.{' '}
              <a href="/disability/how-to-file-claim/">
                Get help filing your claim
              </a>
            </p>
          </li>
          <li className="process-step list-two">
            <h4>Apply</h4>
            <p>Complete this Veteran Readiness and Employment form.</p>
            <p>
              After submitting your application, you’ll get a confirmation
              message. It will include details about your next steps. You can
              print this for your records.
            </p>
          </li>
          <li className="process-step list-three">
            <h4>VA review</h4>
            <p>
              We process applications in the order we receive them. We may
              contact you if we have questions or need more information.
            </p>
          </li>
          <li className="process-step list-four">
            <h4>Decision</h4>
            <p>
              If you’re eligible for Veteran Readiness and Employment benefits,
              we’ll schedule a meeting for you with a Vocational Rehabilitation
              Counselor (VRC). The counselor will work with you to create a
              personalized rehabilitation plan that outlines what VR&E services
              you can get.
            </p>
          </li>
        </ol>
        <p id="vre-orientation-return-post-subway">
          If you’re not sure this is the right form, you can{' '}
          <Link
            aria-describedby="vre-orientation-return-post-subway"
            to="/start"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-start-over',
              });
              sessionStorage.removeItem(WIZARD_STATUS);
            }}
          >
            go back and answer the questions again.
          </Link>
        </p>
      </div>
      <SaveInProgressIntro
        hideUnauthedStartLink
        buttonOnly
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        startText="Apply for Veteran Readiness and Employment"
      />
      <div className="omb-info--container vads-u-margin-top--1p5 vads-u-padding-left--0">
        <va-omb-info
          res-burden={15}
          omb-number="2900-009"
          exp-date="11/30/2022"
        />
      </div>
      <h2 className="vads-u-font-size--h3">To apply by mail</h2>
      <p>
        You must sign in to complete this application online. To apply by mail,
        fill out an Application for Vocational Rehabilitation for Claimants With
        Service-connected Disabilities (VA Form 28-1900) and send it to the
        address below:
      </p>
      <a
        className="vads-u-padding-bottom--2 vads-u-display--inline-block"
        href="/find-forms/about-form-28-1900/"
      >
        <span className="vads-u-padding-right--1 vads-u-font-size--sm">
          <va-icon icon="arrow_downward" size={3} />
        </span>
        Download VA Form 28-1900
      </a>
      <div className="vads-u-border-left--5px vads-u-border-color--primary vads-u-padding--0p5">
        <p className="vads-u-margin--0p5">
          <strong>Department of Veterans Affairs</strong>
        </p>
        <p className="vads-u-margin--0p5">VR&E Intake Center</p>
        <p className="vads-u-margin--0p5">P.O. Box 5210</p>
        <p className="vads-u-margin--0p5">Janesville, WI 53547-5210</p>
      </div>
    </div>
  );
};

export default IntroductionPage;
