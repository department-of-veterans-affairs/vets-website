// import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../utils/constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import FormSavedPage from '../containers/FormSavedPage';
import { submit } from './submit';
// import { defaultDefinitions } from './definitions';
import reportingPeriod from './chapters/02-expenses/reportingPeriod';
import claimantRelationship from './chapters/01-applicant-information/claimantRelationship';
import claimantInformation from './chapters/01-applicant-information/claimantInformation';
import contactInformation from './chapters/01-applicant-information/contactInformation';
import mailingAddress from './chapters/01-applicant-information/mailingAddress';
import veteranInformation from './chapters/01-applicant-information/veteranInformation';
import { careExpensesPages } from './chapters/02-expenses/careExpensesPages';
import { medicalExpensesPages } from './chapters/02-expenses/medicalExpensesPage';
import { mileageExpensesPages } from './chapters/02-expenses/mileageExpensesPage';
import supportingDocuments from './chapters/03-additional-information/supportingDocuments';
import uploadDocuments from './chapters/03-additional-information/uploadDocuments';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/medical_expense_reports/v0/form8416`,
  submit,
  trackingPrefix: 'med-expense-8416',
  // v3SegmentedProgressBar: true,
  dev: {
    // disableWindowUnloadInCI: true,
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  // downtime: {
  //   dependencies: [externalServices.icmhs],
  // },
  formId: VA_FORM_IDS.FORM_21P_8416,
  useCustomScrollAndFocus: false,
  defaultDefinitions: {},
  prefillEnabled: true,
  saveInProgress: {
    messages: {
      inProgress: 'Your medical expense report is in progress.',
      expired:
        'Your saved medical expense report has expired. If you want to submit a Medical Expense Report (21P-8416), please submit a new expense report.',
      saved: 'We saved your medical expense report',
    },
  },
  version: 0,
  formSavedPage: FormSavedPage,
  savedFormMessages: {
    notFound: 'Please start over to submit a medical expense report.',
    noAuth: 'Please sign in again to resume your medical expense report.',
  },
  formOptions: {
    useWebComponentForNavigation: true,
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'claimantFullName',
    },
  },
  title: TITLE,
  subTitle: SUBTITLE,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  // getHelp: GetFormHelp,
  // errorText: ErrorText,
  showReviewErrors: !environment.isProduction() && !environment.isStaging(),
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        claimantRelationship: {
          title: 'Applicant information',
          path: 'applicant/relationship',
          uiSchema: claimantRelationship.uiSchema,
          schema: claimantRelationship.schema,
        },
        claimantInformation: {
          title: 'Your information',
          path: 'applicant/information',
          uiSchema: claimantInformation.uiSchema,
          schema: claimantInformation.schema,
        },
        mailingAddress: {
          title: 'Your address',
          path: 'applicant/mail-address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          title: 'Your contact information',
          path: 'applicant/contact',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        veteranInformation: {
          title: 'Veteran information',
          path: 'applicant/veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
    expenses: {
      title: 'Expenses',
      pages: {
        reportingPeriod: {
          title: 'Reporting period',
          path: 'expenses/reporting-period',
          uiSchema: reportingPeriod.uiSchema,
          schema: reportingPeriod.schema,
        },
        ...careExpensesPages,
        ...medicalExpensesPages,
        ...mileageExpensesPages,
      },
    },
    additionalInformation: {
      title: 'Additional information',
      pages: {
        supportingDocuments: {
          title: 'Supporting documents',
          path: 'expenses/additional-information/supporting-documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        uploadDocuments: {
          title: 'Upload documents',
          path: 'expenses/additional-information/upload-documents',
          uiSchema: uploadDocuments.uiSchema,
          schema: uploadDocuments.schema,
        },
      },
    },
  },
};

export default formConfig;
