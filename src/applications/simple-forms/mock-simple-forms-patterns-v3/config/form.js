import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import relationshipToVeteran from '../pages/relationshipToVeteran';
import serviceBranch from '../pages/serviceBranch';
import uploadFile from '../pages/upload';
import supportingDocuments from '../pages/supportingDocuments';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { treatmentRecordsPages } from '../pages/treatmentRecords';
import { employersPages } from '../pages/employers';
import internationalContact from '../pages/internationalContact';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  dev: {
    showNavLinks: false,
  },
  v3SegmentedProgressBar: true,
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-form-patterns-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'FORM_MOCK_PATTERNS_V3',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for web component examples.',
    noAuth:
      'Please sign in again to continue your application for web component examples.',
  },
  title: 'Explore Pattern Demonstrations in Our Sample Form',
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        personalInformation1: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
        personalInformation2: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
        relationshipToVeteran: {
          path: 'relationship-to-veteran',
          title: 'Relationship to Veteran',
          uiSchema: relationshipToVeteran.uiSchema,
          schema: relationshipToVeteran.schema,
        },
      },
    },
    mailingAddressChapter: {
      title: 'Mailing address',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    internationalContact: {
      title: 'International Contact Information',
      pages: {
        internationalContact: {
          path: 'international-contact',
          title: 'International contact',
          uiSchema: internationalContact.uiSchema,
          schema: internationalContact.schema,
        },
      },
    },
    serviceBranchChapter: {
      title: 'Service Branch',
      pages: {
        serviceBranch: {
          path: 'service-branch',
          title: 'Service Branch',
          uiSchema: serviceBranch.uiSchema,
          schema: serviceBranch.schema,
        },
      },
    },
    uploadFile: {
      title: 'Upload File',
      pages: {
        uploadFile: {
          path: 'upload-file',
          title: 'Upload file',
          uiSchema: uploadFile.uiSchema,
          schema: uploadFile.schema,
        },
      },
    },
    supportingDocuments: {
      title: 'Additional information',
      pages: {
        supportingDocuments: {
          path: 'supporting-documents',
          title: 'Supporting documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
      },
    },
    treatmentRecords: {
      title: 'Treatment records',
      pages: treatmentRecordsPages,
    },
    employers: {
      title: 'Your employers',
      pages: employersPages,
    },
  },
};

export default formConfig;
