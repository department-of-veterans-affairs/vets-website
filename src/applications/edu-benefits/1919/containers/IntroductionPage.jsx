import React, { useEffect } from 'react';

import { scrollAndFocus } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = ({ route }) => {
  useEffect(() => {
    const h1 = document.querySelector('h1');
    scrollAndFocus(h1);
  }, []);
  const { formConfig, pageList } = route;

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Conflicting Interests Certification For Proprietary Schools"
        subtitle="Equal to VA Form 22-1919 (Conflicting Interests Certification For Proprietary Schools)"
      />
      <p className="vads-u-margin-y--2">VA Form 22-1919</p>
      <va-alert status="info" visible>
        <h2 slot="headline">For educational institutions only</h2>
        <p>
          Note: This form is intended for educational institutions submitting
          reports related to potential conflicts of interest.
        </p>
      </va-alert>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2 mobile-lg:vads-u-margin-y--3">
        What to know before you fill out this form
      </h2>
      <p>
        The purpose of this form is to ensure compliance with legal restrictions
        on conflicts of interest related to VA educational assistance benefits.
        These rules help ensure adherence to federal laws by preventing:
      </p>
      <ul>
        <li>
          VA and State Approving Agency (SAA) employees from having any
          financial interest in a school operated for profit.
        </li>
        <li>
          Covered VA employees from receiving services from a school operated
          for profit.
        </li>
        <li>
          Payment of VA educational assistance to any person who is an owner or
          officer of the institution.
        </li>
        <li>
          Veterans and other individuals eligible for VA educational assistance
          from certifying their own enrollment or training at any proprietary
          school. A proprietary school is a privately owned, profit-driven
          institution that offers educational programs or training.
        </li>
      </ul>

      <va-summary-box>
        <h3 slot="headline">Submission guidelines</h3>
        <ul>
          <li>
            This form must be completed and submitted by an authorized
            representative of your institution, such as the President, Chief
            Administrative Officer, or an equivalent official.
          </li>
          <li>
            Each time the information on this form changes, a new submission is
            required.
          </li>
        </ul>
      </va-summary-box>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-bottom--2">
        How to submit this form
      </h2>
      <va-process-list>
        <va-process-list-item header="Complete the form">
          <p>
            Make sure you have all the necessary details, such as your
            institution information, and list of employees with a conflict of
            interest before continuing. Fill out the form online. This is a
            download and upload process. After completing the form, you will
            download a PDF, which you will need to submit later by uploading it
            to the Education File Upload Portal
          </p>
        </va-process-list-item>
        <va-process-list-item header="Download the completed form as a PDF">
          <p>
            When you reach the final step of this form, be sure to download and
            save the PDF to your device.
          </p>
          <p>
            <strong> Note: </strong> This online tool does not submit the form
            for you. You must download your completed form as a PDF and proceed
            to the next step.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Upload your PDF to the Education File Upload Portal or email it to your State Approving Agency (SAA) for approval">
          <p>
            <strong> If your institution has a facility code: </strong> Please
            go to the Education File Upload Portal and upload the completed PDF
            document that you downloaded. This is how you submit this form.
          </p>
          <p>
            <strong>
              If your institution doesn’t have a VA facility code or if you are
              submitting the form because your institution has changed
              ownership:
            </strong>
            Please email the PDF file to your SAA for their approval action. If
            you need help finding their email address, search the SAA contact
            directory (opens in a new tab)
          </p>
        </va-process-list-item>
      </va-process-list>
      <SaveInProgressIntro
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        formConfig={formConfig}
        pageList={pageList}
        startText="Start your Conflicting interests certification for proprietary schools report"
        unauthStartText="Sign in to start your form"
      />
      <p />
      <va-omb-info
        res-burden={10}
        omb-number="2900-0657"
        exp-date="3/31/2027"
      />
    </article>
  );
};

export default IntroductionPage;
