import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  authorizedOfficial,
  agreementType,
  acknowledgements,
  institutionDetailsFacility,
} from '../pages';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-0839-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_0839,
  saveInProgress: {
    messages: {
      inProgress: 'Your form (22-0839) is in progress.',
      expired:
        'Your saved form (22-0839) has expired. Please start a new form.',
      saved: 'Your form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  customText: {
    appSavedSuccessfullyMessage: 'We’ve saved your form.',
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    finishAppLaterMessage: 'Finish this form later',
    startNewAppButtonText: 'Start a new form',
  },
  chapters: {
    personalInformationChapter: {
      title: 'Personal details of authorized official',
      pages: {
        authorizedOfficial: {
          path: 'authorized-official',
          title: 'Authorized Official',
          uiSchema: authorizedOfficial.uiSchema,
          schema: authorizedOfficial.schema,
        },
      },
    },
    agreementTypeChapter: {
      title: 'Agreement type',
      pages: {
        agreementType: {
          path: 'agreement-type',
          title: 'Agreement type',
          uiSchema: agreementType.uiSchema,
          schema: agreementType.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData.agreementType === 'withdrawFromYellowRibbonProgram') {
              goPath('institution-details-facility');
            } else {
              goPath('acknowledgements');
            }
          },
        },
      },
    },
    acknowledgementsChapter: {
      title: 'Acknowledgements of Yellow Ribbon Program terms',
      pages: {
        acknowledgements: {
          path: 'acknowledgements',
          title: 'Acknowledgements of Yellow Ribbon Program terms',
          uiSchema: acknowledgements.uiSchema,
          schema: acknowledgements.schema,
        },
      },
    },
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        institutionDetailsFacility: {
          path: 'institution-details-facility',
          title: 'Institution details',
          uiSchema: institutionDetailsFacility.uiSchema,
          schema: institutionDetailsFacility.schema,
          onNavBack: ({ formData, goPath }) => {
            if (formData.agreementType === 'withdrawFromYellowRibbonProgram') {
              goPath('/agreement-type');
            } else {
              goPath('/acknowledgements');
            }
          },
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
