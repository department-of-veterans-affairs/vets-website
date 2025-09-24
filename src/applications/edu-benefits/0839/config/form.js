import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import submitForm from './submitForm';
import { TITLE, SUBTITLE, SUBMIT_URL } from '../constants';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PrivacyPolicy from '../components/PrivacyPolicy';

import {
  authorizedOfficial,
  agreementType,
  acknowledgements,
  institutionDetailsFacility,
} from '../pages';
import transform from './transform';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitForm,
  trackingPrefix: 'edu-0839-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_0839,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-0839) is in progress.',
    //   expired: 'Your saved education benefits application (22-0839) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  preSubmitInfo: {
    statementOfTruth: {
      heading: 'Certification statement',
      body: PrivacyPolicy,
      messageAriaDescribedby: 'I have read and accept the privacy policy.',
      fullNamePath: 'authorizedOfficial.fullName',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  customText: {
    appType: 'form',
  },
  transformForSubmit: transform,
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
