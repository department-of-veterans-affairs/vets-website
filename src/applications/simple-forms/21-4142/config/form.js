import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';

// pages
import personalInformation1 from '../pages/personalInformation1';
import personalInformation2 from '../pages/personalInformation2';
import contactInformation1 from '../pages/contactInformation1';
import contactInformation2 from '../pages/contactInformation2';
import patientIdentification1 from '../pages/patientIdentification1';
import patientIdentification2 from '../pages/patientIdentification2';
import authorization from '../pages/authorization';
import recordsRequested from '../pages/recordsRequested';
import limitations from '../pages/limitations';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/forms_api/v1/simple_forms`,
  trackingPrefix: 'medical-release-4142-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-4142',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your authorize release of medical information application (21-4142) is in progress.',
    //   expired: 'Your saved authorize release of medical information application (21-4142) has expired. If you want to apply for authorize release of medical information, please start a new application.',
    //   saved: 'Your authorize release of medical information application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for authorize release of medical information.',
    noAuth:
      'Please sign in again to continue your application for authorize release of medical information.',
  },
  title: 'Authorize the release of medical information to the VA',
  subTitle:
    'Authorization to disclose information to the Department of Veterans Affairs (VA) (VA Form 21-4142 & 21-4142a)',
  defaultDefinitions: fullSchema.definitions,
  chapters: {
    personalInformation1Chapter: {
      title: "Veteran's personal information",
      pages: {
        personalInformation1: {
          path: 'personal-information-1',
          title: 'Personal Information',
          uiSchema: personalInformation1.uiSchema,
          schema: personalInformation1.schema,
        },
      },
    },
    personalInformation2Chapter: {
      title: "Veteran's identification information",
      pages: {
        personalInformation2: {
          path: 'personal-information-2',
          title: "Personal Information (cont'd)",
          uiSchema: personalInformation2.uiSchema,
          schema: personalInformation2.schema,
        },
      },
    },
    contactInformation1Chapter: {
      title: "Veteran's mailing address",
      pages: {
        contactInformation1: {
          path: 'contact-information-1',
          title: 'Contact Information',
          uiSchema: contactInformation1.uiSchema,
          schema: contactInformation1.schema,
        },
      },
    },
    contactInformation2Chapter: {
      title: "Veteran's contact information",
      pages: {
        contactInformation2: {
          path: 'contact-information-2',
          title: 'Additional contact information',
          uiSchema: contactInformation2.uiSchema,
          schema: contactInformation2.schema,
        },
      },
    },
    patientIdentificationChapter: {
      title: 'Patient identification',
      pages: {
        patientIdentification1: {
          path: 'patient-identification-1',
          title: 'Are you requesting year own medical records?',
          uiSchema: patientIdentification1.uiSchema,
          schema: patientIdentification1.schema,
        },
        patientIdentification2: {
          path: 'patient-identification-2',
          title: 'Whose records are you granting authorization to release?',
          depends: formData =>
            !formData[patientIdentificationFields.parentObject][
              [patientIdentificationFields.isRequestingOwnMedicalRecords]
            ],
          uiSchema: patientIdentification2.uiSchema,
          schema: patientIdentification2.schema,
        },
      },
    },
    authorizationChapter: {
      title: 'Authorization',
      pages: {
        authorization: {
          path: 'authorization',
          title: 'Authorization',
          uiSchema: authorization.uiSchema,
          schema: authorization.schema,
        },
      },
    },
    recordsRequested: {
      title: 'Records requested',
      pages: {
        recordsRequested: {
          path: 'records-requested',
          title: 'Records requested',
          uiSchema: recordsRequested.uiSchema,
          schema: recordsRequested.schema,
        },
      },
    },
    limitations: {
      title: 'Limitations',
      pages: {
        limitations: {
          path: 'limitations',
          title: 'Do you want to limit the information we can request?',
          uiSchema: limitations.uiSchema,
          schema: limitations.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
