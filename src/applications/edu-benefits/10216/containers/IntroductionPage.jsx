import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import ResBurdenPrivacyPolicy from '../components/ResBurdenPrivacyAct';

const IntroductionPage = ({ route }) => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title="Request exemption from the 85/15 Rule reporting requirements" />
      <p className="vads-u-margin-y--2">
        35% exemption request from 85/15 Rule reporting requirement (VA Form
        22-10216)
      </p>
      <va-alert status="info" visible>
        <h2 slot="headline">For educational institutions only</h2>
        <p>
          Note: This form is not for Veterans. It is intended for educational
          institutions submitting reports regarding VA benefits.
        </p>
      </va-alert>

      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2 mobile-lg:vads-u-margin-y--4">
        What to know before you fill out this form
      </h2>
      <p>
        The 35% exemption is based on total student enrollment at the school
        versus enrollment of students receiving VA benefits and is calculated
        without regard to full-time equivalency. Each student is counted as one
        student. This is different than the 85/15 calculation, which is based on
        supported students versus non-supported students, and which is
        calculated based on full-time equivalency (FTE).
      </p>
      <ul>
        <li>
          Accredited schools: Submit a copy of VA Form 22-10216 by uploading it
          to the{' '}
          <va-link
            text="Education File Upload Portal."
            href="https://www.my.va.gov/EducationFileUploads/s/"
          />
        </li>
        <li>
          Nonaccredited schools: Submit both VA Form 22-10216 and VA Form
          22-10215 (Statement of Assurance of Compliance with 85% Enrollment
          Ratios) for the corresponding term to the{' '}
          <va-link
            text="Education File Upload Portal."
            href="https://www.my.va.gov/EducationFileUploads/s/"
          />
        </li>
        <li>
          <strong>Note for nonaccredited schools:</strong> This 35% exemption
          applies to the submission of routine 85/15 Ratio reports to VA. Your
          Educational & Training Institution must maintain compliance with the
          provisions of the 85/15 Rule for all programs approved to receive GI
          Bill Benefits and must provide 85/15 calculations for any term or
          other enrollment period requested by a VA employee or State Approval
          Agency representative.
        </li>
        <li>
          <strong>Note:</strong> Separate exemption requests (and calculations)
          are required for the main campus and any branch campuses with separate
          administrative capability seeking the 35% exemption. Branches and
          extensions without separate administrative capability are part of the
          main or branch campus under which that extension is approved.
        </li>
      </ul>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-bottom--2">
        How do I submit my exemption request?
      </h2>
      <va-process-list>
        <va-process-list-item header="Complete the form">
          <p>
            Fill out the exemption request form online. You’ll need to download
            and upload the form during this process. After completing the form,
            you will download a PDF, which you will need to submit later by
            uploading it to the Education File Upload Portal. Ensure you have
            all the necessary details, such as your enrollment information,
            institution, and any required documentation, before continuing.
          </p>
          <p>
            <strong>Note for nonaccredited schools: </strong>
            If you are submitting on behalf of a nonaccredited institution, you
            will need to complete and submit both the exemption request form, VA
            Form 22-10216, and VA Form 22-10215 (Statement of Assurance of
            Compliance with 85% Enrollment Ratios) for the corresponding term.
            You’ll need to upload all forms through the Education File Upload
            Portal in Step 3.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Download the completed form as a PDF">
          <p>
            When you reach the final step of this form, be sure to download and
            save the PDF to your device. <strong>Please note: </strong> this
            online tool does not submit the form for you. You must download your
            completed form as a PDF and proceed to the next step.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Upload your PDF to the Education File Upload Portal">
          <p>
            Finally, upload your completed exemption request PDF. For
            nonaccredited schools, upload both VA Form 22-10216 and VA Form
            22-10215.
          </p>
        </va-process-list-item>
      </va-process-list>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-bottom--2">
        What happens after I submit my exemption request?
      </h2>
      <p>
        After submitting your exemption request, we will review your submission
        within 7-10 business days. Once the review is complete, we will email
        your school a letter with the decision. If your request is accepted, we
        will send a letter that includes a copy of the WEAMS 22-1998 Report as
        confirmation. If your request is denied, the letter will explain the
        reason for rejection, and we may provide you with further instructions
        for re-submission or additional steps.
      </p>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--2">
        Information and instructions for completing the 35% exemption request
      </h2>
      <va-accordion>
        <va-accordion-item header="VA Education Service help" id="first">
          <p>
            If you need help calculating your facility’s potential eligibility
            for the 35% exemption, or have questions concerning the 85/15 Rule,
            contact the{' '}
            <va-link
              text="Education Liaison Representative"
              href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp"
            />{' '}
            of jurisdiction.
          </p>
          <div>
            <strong>Note:</strong> The numbers on the instructions match the
            item numbers on the form. Items not shown are self-explanatory.
            <ul>
              <li>
                Provide the full name of your institution as listed on the Web
                Enabled Approval Management System (WEAMS) report (VA Form
                22-1998).
              </li>
              <li>Provide your institution’s VA assigned facility code.</li>
            </ul>
          </div>
        </va-accordion-item>
        <va-accordion-item header="What is a VA beneficiary?" id="second">
          <p>
            A VA beneficiary is any student who is receiving any amount of
            payment from the VA for their training (such as through GI Bill
            benefits or Veteran Readiness and Employment benefits).
          </p>
        </va-accordion-item>
        <va-accordion-item
          header="VA beneficiary student percentage"
          id="third"
        >
          <p>
            The result of students provided in the "total number of VA
            beneficiary students" field divided by the "total number of
            students" field.
          </p>
          <h4 className="vads-u-margin-y--3">35% calculation example</h4>
          <ul>
            <li>Total number of students enrolled at your school: 1,000</li>
            <li>
              Total number of VA beneficiaries enrolled at your school: 250
            </li>
          </ul>
          <p>
            <strong>Note:</strong> To calculate the percentage for the 35%
            exemption, divide the number of VA beneficiaries (250) by the total
            number of enrolled students (1,000).
          </p>
          <p>
            250 divided by 1,000 is .25. To convert the quotient to a
            percentage, move the decimal point two spaces to the right and add
            the '%' sign after the last digit (.25 is 25%).
          </p>
        </va-accordion-item>
        <va-accordion-item header="Date of calculation" id="fourth">
          <p>
            Provide the date that 85/15 calculation was performed. This date
            must be on or after but not later than 30 days after the start date
            of the term or other enrollment period.
          </p>
        </va-accordion-item>
        <va-accordion-item header="Submission timelines" id="fifth">
          <p>
            Educational & Training Institutions must submit the exemption
            request:
          </p>
          <ul>
            <li>
              No later than 30 days after the beginning of the first term for
              which the school wants the exemption to apply if the school is
              organized on a standard-length term basis.
            </li>
            <li>
              No later than 30 days after the beginning of the first
              non-standard-length for which the school wishes the exemption to
              apply if the school is organized on a non-standard-term basis.
            </li>
          </ul>
        </va-accordion-item>
      </va-accordion>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        Start the form
      </h2>
      <SaveInProgressIntro
        testActionLink
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        formConfig={route.formConfig}
        pageList={route.pageList}
        startText="Start your 35% exemption request"
        headingLevel={2}
        unauthStartText="Sign in to start your form"
      />
      <p className="vads-u-padding-bottom--0 mobile-lg:vads-u-padding-bottom--0p5" />

      <va-omb-info res-burden={30} omb-number="2900-0896" exp-date="1/31/2028">
        <ResBurdenPrivacyPolicy />
      </va-omb-info>
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      downtime: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }).isRequired,
};

export default IntroductionPage;
