import React from 'react';

import { focusElement } from '@department-of-veterans-affairs/platform-forms-system/ui';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro'; // '@' import not working
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import OMBInfo from '../components/IntroductionPage/OMBInfo';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle title="Apply for CHAMPVA benefits" subTitle="Form 10-10d" />

        <p>
          If you’re the spouse or child of a Veteran with disabilities, or the
          surviving spouse or child of a Veteran who has died, use VA Form
          10-10d to apply for health benefits through CHAMPVA (the Civilian
          Health and Medical Program of the Department of Veterans Affairs).
        </p>

        <VaAlert status="info" visible uswds>
          <h2>Have you applied for VA health care before?</h2>
          <SaveInProgressIntro
            buttonOnly
            headingLevel={2}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            unauthStartText="Sign in to check your application status"
            hideUnauthedStartLink
          />
        </VaAlert>

        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps to apply for CHAMPVA benefits.
        </h2>
        <va-process-list uswds>
          <va-process-list-item header="Prepare">
            <p>When you apply, be sure to have these on hand:</p>
            <ul>
              <li>Required information</li>
              <li>Veteran’s Social Security number</li>
              <li>Veteran’s VA file number, if you know it</li>
              <li>
                Veteran’s address, phone number, and email where we can contact
                them, if you know it
              </li>
              <li>
                Veteran’s date of birth, marriage, and death (if applicable)
              </li>
              <li>Additional applicants’ Social Security numbers</li>
              <li>Additional applicants’ dates of birth</li>
              <li>
                Additional applicants’ address, phone number, and email where we
                can contact them
              </li>
            </ul>

            <p>Supporting documents to submit:</p>
            <ul>
              <li>
                The page from the VBA rating decision showing your Veteran is
                permanently and totally disabled (or the death rating if you’re
                a survivor)
              </li>
              <li>
                Your Veteran’s DD214 (Certificate of Release or Discharge from
                Active Duty)—or, if the Veteran was a World War II or Korean War
                Veteran, the Report of Separation. If you don’t have a copy of
                the necessary form, you can request it by submitting a{' '}
                <a href="https://www.archives.gov/veterans/military-service-records/standard-form-180.html">
                  Standard Form 180, Request Pertaining to Military Records
                </a>
                , from the National Archives.
              </li>
              <li>
                <a href="https://www.archives.gov/veterans/military-service-records">
                  Find out how to request military service records online, by
                  mail, or by fax
                </a>
              </li>
              <li>
                Documents related to any dependent children you’re including in
                your application:
              </li>
              <li>
                A copy of each child’s birth certificate or adoption papers
              </li>
              <li>
                School certification of enrollment for children ages 18-23.
                <br />
                <a href="https://www.va.gov/COMMUNITYCARE/docs/pubfiles/factsheets/FactSheet_01-15.pdf">
                  View our fact sheet on school enrollment certification
                  requirements - PDF
                </a>
              </li>
              <li>
                A copy of documents related to the applicant’s marriage status:
              </li>
              <li>A copy of your marriage certificate</li>
              <li>A copy of the document that ended your marriage</li>
              <li>
                Documents related to the applicant’s other healthcare status
                CHAMPVA Other Health (OHI) Certification form 10-7959c:
              </li>
              <li>A copy of your Medicare card(s)</li>
              <li>A copy of your health insurance card(s)</li>
            </ul>
          </va-process-list-item>
          <va-process-list-item header="Apply">
            <p>Complete this application for CHAMPVA benefits form.</p>
            <p>
              After submitting your application, you’ll get a confirmation
              message. It will include details about your next steps.
            </p>
            <p>You can print this for your records.</p>
          </va-process-list-item>
          <va-process-list-item header="Submit supporting and optional documentation">
            <p>
              Before submitting your application online you will need to upload
              additional documents. We will let you know what documents you will
              need at this step.
            </p>
            <p>
              You may also choose to mail in your supporting documents. We will
              let you know what documents you will need and where to mail them
              after you submit your form online.
            </p>
          </va-process-list-item>

          <va-process-list-item header="VA Review">
            <p>
              We process applications in the order we receive them. We may
              contact you if we have questions or need more information.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Decision">
            <p>
              After you’ve applied for CHAMPVA, we’ll send you a letter in the
              mail to let you know if your application has been approved.
            </p>
            <va-additional-info trigger="How long will it take to hear back about my application?">
              If you send us all required and optional documents — and if your
              application is complete — it’ll take about 6 weeks after we get
              your package until you get your CHAMPVA ID card and related
              materials.
              <br />
              <br />
              If you submit the application without the optional documents, it
              may take 2 to 8 months since we’ll need to confirm your
              information with other federal agencies.
            </va-additional-info>
          </va-process-list-item>
        </va-process-list>

        <VaAlert status="info" visible uswds>
          <h2>Sign in now to save time and save your work in progress</h2>
          <p>Here’s how signing in now helps you:</p>
          <ul>
            <li>
              We can fill in some of your information for you to save you time.
            </li>
            <li>
              You can save your work in progress. You’ll have 60 days from when
              you start or make updates to your application to come back and
              finish it.
            </li>
          </ul>
          <p>
            <strong>Note:</strong> You can sign in after you start your
            application. But you’ll lose any information you already filled in.
          </p>
          <SaveInProgressIntro
            buttonOnly
            headingLevel={2}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            startText="Start the Application"
          />
        </VaAlert>
        <br />
        <OMBInfo resBurden={10} ombNumber="2900-0219" expDate="10/31/2024" />

        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          What if I need help filling out my application?
        </h2>
        <p>
          An accredited representative, like a Veterans Service Officer (VSO),
          can help you fill out your application.
          <a href="https://www.va.gov/COMMUNITYCARE/programs/dependents/champva/CITI.asp">
            Find out if you can get care at a local VA medical center when
            you’re covered under CHAMPVA
          </a>
        </p>
      </article>
    );
  }
}

export default IntroductionPage;
