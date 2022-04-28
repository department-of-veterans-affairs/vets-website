// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/00-1234-schema.json';

// In a real app this would not be imported directly; instead the schema that
// is imported from vets-json-schema should include these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import { VA_FORM_IDS } from 'platform/forms/constants';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import applicantInformation from '../pages/applicantInformation';
import serviceHistory from '../pages/serviceHistory';
import contactInformation from '../pages/contactInformation';
import directDeposit from '../pages/directDeposit';
import expandUnder from '../pages/expandUnder';
import conditionalFields from '../pages/conditionalFields';
import conditionalPages from '../pages/conditionalPages';
import radioButtonGroup from '../pages/radioButtonGroup';
import checkboxGroupPattern from '../pages/checkboxGroupPattern';

import singleCheckbox from '../pages/singleCheckbox';
import groupCheckbox from '../pages/checkboxGroupValidation';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;

import initialData from '../tests/fixtures/data/test-data.json';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-1234',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_MOCK,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Mock form application (00-1234) is in progress.',
    //   expired: 'Your saved Mock form application (00-1234) has expired. If you want to apply for Mock form, please start a new application.',
    //   saved: 'Your Mock form application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: 'Please start over to apply for Mock form.',
    noAuth: 'Please sign in again to continue your application for Mock form.',
  },
  title: 'Mock Form',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    // ** Complex Form
    applicantInformationChapter: {
      title: 'Chapter Title: Applicant Information (Basic Form elements)',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Section Title: Applicant Information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
          initialData, // Add prefill data to form
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Chapter Title: Service History (Simple array loop)',
      pages: {
        serviceHistory: {
          path: 'service-history',
          title: 'Section Title: Service History',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
      },
    },
    additionalInformationChapter: {
      title: 'Chapter Title: Additional Information (manual method)',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Section Title: Contact Information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        directDeposit: {
          path: 'direct-deposit',
          title: 'Section Title: Direct Deposit',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
        },
      },
    },
    // // ** Intermediate tutorial examples
    intermediateTutorialChapter: {
      title: 'Chapter Title: Intermediate tutorial examples',
      pages: {
        expandUnder: {
          path: 'expand-under',
          title: 'Section Title: Expand under', // ignored?
          uiSchema: expandUnder.uiSchema,
          schema: expandUnder.schema,
        },
        conditionalFields: {
          path: 'conditionally-hidden',
          title: 'Section Title: Conditionally hidden',
          uiSchema: conditionalFields.uiSchema,
          schema: conditionalFields.schema,
        },
        conditionalPages: {
          title: 'Section Title: Conditional page',
          path: 'conditional-page',
          uiSchema: conditionalPages.uiSchema,
          schema: conditionalPages.schema,
        },
      },
    },
    // https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/available-features-and-usage-guidelines/
    availableFeaturesAndUsage: {
      title: 'Chapter Title: Available features and usage guidelines examples',
      pages: {
        radioButtonGroup,
        checkboxGroupPattern,
      },
    },

    workaroundsChapter: {
      title: 'Chapter Title: Workarounds for form widget problems',
      pages: {
        singleCheckbox,
        groupCheckbox,
      },
    },
  },
};

export default formConfig;
