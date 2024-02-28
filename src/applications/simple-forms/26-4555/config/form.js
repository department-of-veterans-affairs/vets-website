import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';

import footerContent from 'platform/forms/components/FormFooter';
import transformForSubmit from './submit-transformer';
import prefillTransformer from './prefill-transformer';
import getHelp from '../../shared/components/GetFormHelp';

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

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  trackingPrefix: 'adapted-housing-4555-',
  transformForSubmit,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I certify that I am applying for assistance in acquiring specially adapted housing or special home adaptation grant because of the nature of my service-connected disability. I understand that there are medical and economic features yet to be considered before I am eligible for this benefit, and that I will be notified of the action taken on this application as soon as possible.',
      messageAriaDescribedby:
        'I certify that I am applying for assistance in acquiring specially adapted housing or special home adaptation grant because of the nature of my service-connected disability. I understand that there are medical and economic features yet to be considered before I am eligible for this benefit, and that I will be notified of the action taken on this application as soon as possible.',
    },
  },
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
          title: 'Personal information',
          uiSchema: personalInformation1.uiSchema,
          schema: personalInformation1.schema,
        },
        personalInformation2: {
          path: 'personal-information-2',
          title: 'Identification information',
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
          title: 'Mailing address',
          uiSchema: contactInformation1.uiSchema,
          schema: contactInformation1.schema,
        },
        contactInformation2: {
          path: 'contact-information-2',
          title: 'Phone number and email address',
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
          title: 'Specially adapted housing grant applications',
          uiSchema: previousSahApplication1.uiSchema,
          schema: previousSahApplication1.schema,
        },
        previousSahApplication2: {
          path: 'previous-sah-application-2',
          title: 'Past SAH grant application details',
          depends: formData =>
            formData[previousSahApplicationFields.parentObject][
              previousSahApplicationFields.hasPreviousSahApplication
            ],
          uiSchema: previousSahApplication2.uiSchema,
          schema: previousSahApplication2.schema,
        },
        previousShaApplication1: {
          path: 'previous-sha-application-1',
          title: 'Special home adaptation grant applications',
          uiSchema: previousHiApplication1.uiSchema,
          schema: previousHiApplication1.schema,
        },
        previousShaApplication2: {
          path: 'previous-sha-application-2',
          title: 'Past SHA grant applications details',
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
          title: 'Current arrangement',
          uiSchema: livingSituation1.uiSchema,
          schema: livingSituation1.schema,
        },
        livingSituation2: {
          path: 'living-situation-2',
          title: 'Facility details',
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
          title: 'Service-connected conditions',
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
