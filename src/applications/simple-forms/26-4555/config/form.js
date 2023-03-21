import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';

import footerContent from 'platform/forms/components/FormFooter';
import preSubmitInfo from '../containers/PreSubmitSignature';
import transformForSubmit from './submit-transformer';
import prefillTransformer from './prefill-transformer';
import getHelp from '../containers/GetFormHelp';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import personalInformation1 from '../pages/personalInformation1';
import personalInformation2 from '../pages/personalInformation2';
import contactInformation1 from '../pages/contactInformation1';
import contactInformation2 from '../pages/contactInformation2';
import previousSahApplication1 from '../pages/previousSahApplication1';
import previousSahApplication2 from '../pages/previousSahApplication2';
import previousHiApplication1 from '../pages/previousHiApplication1';
import previousHiApplication2 from '../pages/previousHiApplication2';
import livingSituation1 from '../pages/livingSituation1';
import livingSituation2 from '../pages/livingSituation2';
import remarks from '../pages/remarks';

// constants
import {
  previousSahApplicationFields,
  previousHiApplicationFields,
  livingSituationFields,
} from '../definitions/constants';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/forms_api/v1/simple_forms`,
  trackingPrefix: 'adapted-housing-4555-',
  transformForSubmit,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo,
  formId: '26-4555',
  saveInProgress: {
    messages: {
      inProgress:
        'Your specially adapted housing grant (26-4555) application is in progress.',
      expired:
        'Your saved specially adapted housing grant (26-4555) application has expired.',
      saved:
        'Your specially adapted housing grant (26-4555) application has been saved.',
    },
  },
  savedFormMessages: {
    notFound:
      'Please start over to fill out the specially adapted housing grant (26-4555) application.',
    noAuth:
      'Please sign in again to continue your specially adapted housing grant (26-4555) application.',
  },
  version: 0,
  migrations: [],
  prefillEnabled: true,
  prefillTransformer,
  title: 'Apply for an adapted housing grant',
  subTitle:
    'Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant (VA Form 26-4555)',
  defaultDefinitions: fullSchema.definitions,
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        personalInformation1: {
          path: 'personal-information-1',
          title: 'Personal Information',
          uiSchema: personalInformation1.uiSchema,
          schema: personalInformation1.schema,
        },
        personalInformation2: {
          path: 'personal-information-2',
          title: "Personal Information (cont'd)",
          uiSchema: personalInformation2.uiSchema,
          schema: personalInformation2.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        contactInformation1: {
          path: 'contact-information-1',
          title: 'Contact Information',
          uiSchema: contactInformation1.uiSchema,
          schema: contactInformation1.schema,
        },
        contactInformation2: {
          path: 'contact-information-2',
          title: 'Additional contact information',
          uiSchema: contactInformation2.uiSchema,
          schema: contactInformation2.schema,
        },
      },
    },
    previousApplicationsChapter: {
      title: 'Your past applications',
      pages: {
        previousSahApplication1: {
          path: 'previous-sah-application-1',
          title:
            'Have you previously applied for a specially adapted housing (SAH) grant?',
          uiSchema: previousSahApplication1.uiSchema,
          schema: previousSahApplication1.schema,
        },
        previousSahApplication2: {
          path: 'previous-sah-application-2',
          title:
            'Details about your past application for a specially adapted housing grant',
          depends: formData =>
            formData[previousSahApplicationFields.parentObject][
              previousSahApplicationFields.hasPreviousSahApplication
            ],
          uiSchema: previousSahApplication2.uiSchema,
          schema: previousSahApplication2.schema,
        },
        previousShaApplication1: {
          path: 'previous-sha-application-1',
          title: 'Have you applied for a special home adaptation (SHA) grant?',
          uiSchema: previousHiApplication1.uiSchema,
          schema: previousHiApplication1.schema,
        },
        previousShaApplication2: {
          path: 'previous-sha-application-2',
          title:
            'Details about your past application for a special home adaptation grant',
          depends: formData =>
            formData[previousHiApplicationFields.parentObject][
              previousHiApplicationFields.hasPreviousHiApplication
            ],
          uiSchema: previousHiApplication2.uiSchema,
          schema: previousHiApplication2.schema,
        },
      },
    },
    livingSituationChapter: {
      title: 'Your current living arrangement',
      pages: {
        livingSituation1: {
          path: 'living-situation-1',
          title:
            'Are you currently living in a nursing home or medical care facility?',
          uiSchema: livingSituation1.uiSchema,
          schema: livingSituation1.schema,
        },
        livingSituation2: {
          path: 'living-situation-2',
          title: 'Details about your current living situation',
          depends: formData =>
            formData[livingSituationFields.parentObject][
              livingSituationFields.isInCareFacility
            ],
          uiSchema: livingSituation2.uiSchema,
          schema: livingSituation2.schema,
        },
      },
    },
    additionalInformationChapter: {
      title: 'Your conditions',
      pages: {
        remarks: {
          path: 'additional-information',
          title: 'Additional information',
          uiSchema: remarks.uiSchema,
          schema: remarks.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
