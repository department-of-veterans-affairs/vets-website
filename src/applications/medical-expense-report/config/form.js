import React from 'react';
import environment from 'platform/utilities/environment';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../utils/constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import FormSavedPage from '../containers/FormSavedPage';
// import prefillTransformer from './prefill-transformer';
import { transform } from './submit-transformer';
// import { defaultDefinitions } from './definitions';
import claimantRelationship from './chapters/01-applicant-information/claimantRelationship';
import claimantInformation from './chapters/01-applicant-information/claimantInformation';
import contactInformation from './chapters/01-applicant-information/contactInformation';
import mailingAddress from './chapters/01-applicant-information/mailingAddress';
import veteranInformation from './chapters/01-applicant-information/veteranInformation';
import firstTimeReporting from './chapters/02-expenses/firstTimeReporting';
import effectiveDates from './chapters/02-expenses/effectiveDates';
import reportingPeriod from './chapters/02-expenses/reportingPeriod';
import { careExpensesPages } from './chapters/02-expenses/careExpensesPages';
import { medicalExpensesPages } from './chapters/02-expenses/medicalExpensesPage';
import { mileageExpensesPages } from './chapters/02-expenses/mileageExpensesPage';
import supportingDocuments from './chapters/03-additional-information/supportingDocuments';
import uploadDocuments from './chapters/03-additional-information/uploadDocuments';
import expensesReview from './chapters/02-expenses/expensesReview';
import GetFormHelp from '../components/GetFormHelp';
import { onFormLoaded } from './onFormLoaded';
import { hasNoExpenses, hasCareExpenses } from './chapters/02-expenses/helpers';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/medical_expense_reports/v0/form8416`,
  transformForSubmit: transform,
  trackingPrefix: 'med-expense-8416',
  v3SegmentedProgressBar: true,
  dev: {
    // disableWindowUnloadInCI: true,
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  // downtime: {
  //   dependencies: [externalServices.icmhs],
  // },
  formId: VA_FORM_IDS.FORM_21P_8416,
  // useCustomScrollAndFocus: false,
  defaultDefinitions: commonDefinitions,
  prefillEnabled: true,
  // prefillTransformer,
  saveInProgress: {
    messages: {
      inProgress: 'Your medical expense report is in progress.',
      expired:
        'Your saved medical expense report has expired. If you want to submit a Medical Expense Report (21P-8416), please submit a new expense report.',
      saved: 'We saved your medical expense report',
    },
  },
  onFormLoaded,
  version: 0,
  formSavedPage: FormSavedPage,
  savedFormMessages: {
    notFound: 'Please start over to submit a medical expense report.',
    noAuth: 'Please sign in again to resume your medical expense report.',
  },
  preSubmitInfo: {
    statementOfTruth: {
      body: (
        <div>
          <p>
            I confirm that the identifying information in this form is accurate
            and has been represented correctly.
          </p>
          <p>
            <span className="vads-u-font-weight--bold">
              I have not and will not
            </span>{' '}
            receive reimbursement for these expenses. I certify the information
            contained on this form and the attached addendums is a true
            representation of expenses I have paid.
          </p>
        </div>
      ),
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly. I have not and will not receive reimbursement for these expenses. I certify the information contained on this form and the attached addendums is a true representation of expenses I have paid.',
      fullNamePath: 'claimantFullName',
    },
  },
  title: TITLE,
  subTitle: SUBTITLE,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  // errorText: ErrorText,
  showReviewErrors: !environment.isProduction() && !environment.isStaging(),
  chapters: {
    applicantInformation: {
      title: 'Your information',
      pages: {
        claimantRelationship: {
          title: 'Your identity',
          path: 'applicant',
          uiSchema: claimantRelationship.uiSchema,
          schema: claimantRelationship.schema,
        },
        claimantInformation: {
          title: 'Your name',
          path: 'applicant/information',
          uiSchema: claimantInformation.uiSchema,
          schema: claimantInformation.schema,
        },
        mailingAddress: {
          title: 'Your mailing address',
          path: 'applicant/mail-address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          title: 'Your email address and phone number',
          path: 'applicant/contact',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        veteranInformation: {
          title: formData =>
            formData?.claimantNotVeteran
              ? 'Veteran’s information'
              : 'Your identification information',

          path: 'applicant/veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
    expenses: {
      title: 'Expenses',
      pages: {
        firstTimeReporting: {
          title: 'Reporting expenses',
          path: 'expenses',
          uiSchema: firstTimeReporting.uiSchema,
          schema: firstTimeReporting.schema,
        },
        effectiveDates: {
          title: 'Reporting period effective date',
          path: 'expenses/effective-dates',
          depends: formData => formData?.firstTimeReporting === true,
          uiSchema: effectiveDates.uiSchema,
          schema: effectiveDates.schema,
        },
        reportingPeriod: {
          title: 'Reporting period dates',
          path: 'expenses/reporting-period-dates',
          depends: formData => formData?.firstTimeReporting === false,
          uiSchema: reportingPeriod.uiSchema,
          schema: reportingPeriod.schema,
        },
        ...careExpensesPages,
        ...medicalExpensesPages,
        ...mileageExpensesPages,
        expensesReview: {
          title: 'Review expenses',
          path: 'expenses/review',
          depends: formData => hasNoExpenses(formData),
          uiSchema: expensesReview.uiSchema,
          schema: expensesReview.schema,
        },
      },
    },
    additionalInformation: {
      title: 'Additional information',
      pages: {
        supportingDocuments: {
          title: 'Supporting documents',
          path: 'supporting-documents',
          depends: formData => hasCareExpenses(formData),
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        uploadDocuments: {
          title: 'Upload documents',
          path: 'upload-documents',
          uiSchema: uploadDocuments.uiSchema,
          schema: uploadDocuments.schema,
        },
      },
    },
  },
};

export default formConfig;
