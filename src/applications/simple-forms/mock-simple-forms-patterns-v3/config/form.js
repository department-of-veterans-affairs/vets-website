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
import {
  supportingDocumentsArrayRequiredPages,
  supportingDocumentsArrayOptionalPages,
} from '../pages/supportingDocumentsArray';
import internationalContact from '../pages/internationalContact';
import BackToIntroLink from '../components/BackToIntroLink';

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
          ContentBeforeButtons: BackToIntroLink,
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
        personalInformation2: {
          path: 'identification-information',
          title: 'Identification information',
          ContentBeforeButtons: BackToIntroLink,
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
        relationshipToVeteran: {
          path: 'relationship-to-veteran',
          title: 'Relationship to Veteran',
          ContentBeforeButtons: BackToIntroLink,
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
          ContentBeforeButtons: BackToIntroLink,
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
          ContentBeforeButtons: BackToIntroLink,
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
          ContentBeforeButtons: BackToIntroLink,
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
          ContentBeforeButtons: BackToIntroLink,
          uiSchema: serviceBranch.uiSchema,
          schema: serviceBranch.schema,
        },
      },
    },
    uploadFile: {
      title: 'File upload single',
      pages: {
        uploadFile: {
          path: 'upload-file',
          title: 'Upload file',
          ContentBeforeButtons: BackToIntroLink,
          uiSchema: uploadFile.uiSchema,
          schema: uploadFile.schema,
        },
      },
    },
    supportingDocuments: {
      title: 'File upload multiple',
      pages: {
        supportingDocuments: {
          path: 'supporting-documents',
          title: 'Supporting documents',
          ContentBeforeButtons: BackToIntroLink,
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
      },
    },
    supportingDocumentsArrayRequired: {
      title: 'File upload multiple + additional info (required)',
      pages: supportingDocumentsArrayRequiredPages,
    },
    supportingDocumentsArrayOptional: {
      title: 'File upload multiple + additional info (optional)',
      pages: supportingDocumentsArrayOptionalPages,
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
