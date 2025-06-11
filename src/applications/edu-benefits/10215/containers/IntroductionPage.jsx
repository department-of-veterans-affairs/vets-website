import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';

import OmbInfo from '../components/OmbInfo';

const IntroductionPage = ({ route }) => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title="Report 85/15 rule enrollment ratios" />
      <p className="vads-u-margin-y--2">
        Statement of Assurance of Compliance with 85% Enrollment Ratios (VA Form
        22-10215)
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
        Use this form (VA Form 22-10215) to provide 85/15 calculations as
        required by{' '}
        <va-link
          text="Title 38 United States Code (U.S.C.) 3680A(d)"
          href="https://uscode.house.gov/view.xhtml?req=(title:38%20section:3680A%20edition:prelim)%20OR%20(granuleid:USC-prelim-title38-section3680A)&f=treesort&edition=prelim&num=0&jumpTo=true"
        />{' '}
        and{' '}
        <va-link
          text="38 Code of Federal Regulations (CFR) 21.4201"
          href="https://www.ecfr.gov/current/title-38/chapter-I/part-21/subpart-D/subject-group-ECFRf512caa42cbfa1f/section-21.4201"
        />
        . This form is only utilized by Institutions of Higher Learning (IHLs)
        and Non-College Degree (NCD) schools. Vocational Flight Schools may
        submit a Statement of Assurance of Compliance with 85 Percent Enrollment
        Ratios for Vocational Flight.
      </p>
      <p>
        By regulation 38 CFR 21.4201(f)(2), schools WITHOUT an approved 35
        percent exemption are obligated to report all 85/15 calculations to the
        VA. To find due dates for submitting your calculations each term, please
        review the "More information about reporting your 85/15 rule enrollment
        ratios" section of this page.
      </p>
      <p>
        <va-link
          external
          text="Learn more about the 85/15 rule"
          href="https://benefits.va.gov/GIBILL/85_15/85_15_homepage.asp"
        />
      </p>
      <p>
        Please take the time to review the calculation instructions we have
        provided. It may be helpful to keep them open in a new tab while you
        complete the rest of this form so that you can easily access them as you
        report all of your calculations.
      </p>
      <p>
        <va-link
          external
          text="Review the calculation instructions"
          href="/school-administrators/85-15-rule-enrollment-ratio/calculation-instructions"
        />
      </p>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-bottom--2">
        How to submit this form
      </h2>
      <va-process-list>
        <va-process-list-item header="Complete the form">
          <p>
            Fill out the form online. This is a download and upload process.
            After completing the form, you will download a PDF, which you will
            need to submit later by uploading it to the Education File Upload
            Portal. Ensure you have all the necessary details, such as your
            enrollment information, institution, and any required documentation,
            before continuing.
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
            As the final step of this form, please go to the Education File
            Upload Portal and upload the completed PDF document that you
            downloaded. This is how you submit this form.
          </p>
        </va-process-list-item>
      </va-process-list>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--2">
        More information about this form
      </h2>
      <va-accordion>
        <va-accordion-item
          header="What are the due dates for submitting my 85/15 rule enrollment ratios?"
          id="first"
        >
          <p className="vads-u-font-weight--bold">Term-based schools:</p>
          <p>
            A school organized on a standard-length term basis must provide
            85/15 calculations to VA no later than 30 days after the start of
            each regular school term (excluding summer terms), or before the
            beginning date of the next term, whichever is earlier.
          </p>
          <p className="vads-u-margin-bottom--0">Example:</p>
          <va-table>
            <va-table-row>
              <span>Enrollment period</span>
              <span>Start date</span>
              <span>Report due date</span>
            </va-table-row>
            <va-table-row>
              <span>Spring Term</span>
              <span>January 13, 2025</span>
              <span>February 12, 2025</span>
            </va-table-row>
            <va-table-row>
              <span>Fall Term</span>
              <span>August 25, 2025</span>
              <span>September 24, 2025</span>
            </va-table-row>
          </va-table>
          <p className="vads-u-font-weight--bold">Non-term-based schools:</p>
          <p>
            A school organized on a non-standard-length term basis must provide
            85/15 calculations to VA no later than 30 days after the beginning
            of each enrollment period.{' '}
          </p>
          <p className="vads-u-margin-bottom--0">Example:</p>
          <va-table>
            <va-table-row>
              <span>Enrollment period</span>
              <span>Start date</span>
              <span>Report due date</span>
            </va-table-row>
            <va-table-row>
              <span>Module/Cohort/Pathway 1</span>
              <span>January 20, 2025</span>
              <span>February 19, 2025</span>
            </va-table-row>
            <va-table-row>
              <span>Module/Cohort/Pathway 2</span>
              <span>February 24, 2025</span>
              <span>March 26, 2025</span>
            </va-table-row>
            <va-table-row>
              <span>Module/Cohort/Pathway 3</span>
              <span>March 31, 2025</span>
              <span>April 30, 2025</span>
            </va-table-row>
          </va-table>
          <ul>
            <li>
              Includes schools/programs that operate on a modular basis or other
              system wherein students complete a section of each program and
              start a new section at the start of the next enrollment period
            </li>
            <li>
              Does not include those term-, semester-, or quarter-based schools
              offering "mini-mesters," where classes commence later in the term
              to run on an accelerated schedule
            </li>
          </ul>
        </va-accordion-item>
        <va-accordion-item
          header="What happens after I submit my 85/15 rule enrollment ratios?"
          id="second"
        >
          <p>
            After you submit your 85/15 rule enrollment ratios, we will review
            them within 7-10 business days. Once we review your submission, we
            will email you with our determinations, and any next steps.
          </p>
        </va-accordion-item>
        <va-accordion-item
          header="How do I request an exemption from routine 85/15 rule enrollment ratio reporting? "
          id="third"
        >
          <p>
            You may request an exemption from routine reporting of 85/15
            calculations if the number of VA beneficiaries at your school does
            not exceed 35 percent of the total enrollment. This figure should be
            calculated separately for the main campus and any
            separately-approved branch campuses. To request a 35 percent
            exemption from 85/15 routine reporting, please submit the "35
            percent Exemption Request From 85/15 Reporting Requirement" (VA Form
            22-10216). Detailed instructions are provided on that form.{' '}
            <va-link
              text="Go to VA Form 22-10216"
              href="/school-administrators/35-percent-exemption/introduction"
            />
            .
          </p>
          <p>
            <strong>Special note for accredited schools:</strong> If your school
            is accredited and qualifies for the 35 percent exemption, it is NOT
            necessary to complete OR submit VA Form 22-10215.
          </p>
          <p>
            <strong>Non-accredited schools:</strong> Must complete and submit VA
            Form 22-10215 with the 35 percent exemption request.
          </p>
        </va-accordion-item>
      </va-accordion>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        Start the form
      </h2>
      <SaveInProgressIntro
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        formConfig={route.formConfig}
        pageList={route.pageList}
        startText="Start your 85/15 calculations report"
        unauthStartText="Sign in to start your form"
      />
      <p className="vads-u-padding-bottom--0 mobile-lg:vads-u-padding-bottom--0p5" />

      <OmbInfo />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
