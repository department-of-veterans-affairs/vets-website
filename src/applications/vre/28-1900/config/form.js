import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import {
  TITLE,
  SUBTITLE,
  YOUR_INFORMATION_CHAPTER_CONSTANTS,
  CONTACT_INFORMATION_CHAPTER_CONSTANTS,
} from '../constants';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import getHelp from '../components/GetFormHelp';
import preSubmitInfo from '../components/PreSubmitInfo';

import educationPage from '../pages/education';
import movingYesNoPage from '../pages/movingYesNo';
import newAddressPage from '../pages/newAddress';
import personalInformationPage from '../pages/personalInformation';
import phoneAndEmailPage from '../pages/phoneAndEmail';
import veteranAddressPage from '../pages/veteranAddress';

import transformForSubmit from './submit-transformer';
import { prefillTransformer } from '../utils/prefill-transformer';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  submitUrl: `${environment.API_URL}/v0/veteran_readiness_employment_claims`,
  trackingPrefix: 'new-careers-employment-28-1900-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  stepLabels: 'Your information;Contact information;Review',
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formOptions: {
    useWebComponentForNavigation: true,
  },
  formId: VA_FORM_IDS.FORM_28_1900,
  saveInProgress: {
    messages: {
      inProgress:
        'Your VR&E Chapter 31 benefits application (28-1900) is in progress.',
      expired:
        'Your saved VR&E Chapter 31 benefits application (28-1900) has expired. If you want to apply for Chapter 31 benefits, start a new application.',
      saved: 'Your Chapter 31 benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Start over to apply for Veteran Readiness and Employment.',
    noAuth:
      'Sign in again to continue your application for Vocational Readiness and Employment.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  downtime: {
    requiredForPrefill: true,
    dependencies: [externalServices.vre],
  },
  useCustomScrollAndFocus: true,
  preSubmitInfo,
  chapters: {
    yourInformationChapter: {
      title: 'Your information',
      pages: {
        personalInformationPage: {
          path: 'personal-information',
          title:
            YOUR_INFORMATION_CHAPTER_CONSTANTS.personalInformationPageTitle,
          uiSchema: personalInformationPage.uiSchema,
          schema: personalInformationPage.schema,
        },
        educationPage: {
          path: 'education',
          title: YOUR_INFORMATION_CHAPTER_CONSTANTS.educationPageTitle,
          uiSchema: educationPage.uiSchema,
          schema: educationPage.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        veteranAddressPage: {
          path: 'veteran-address',
          title: CONTACT_INFORMATION_CHAPTER_CONSTANTS.veteranAddressPageTitle,
          uiSchema: veteranAddressPage.uiSchema,
          schema: veteranAddressPage.schema,
        },
        movingYesNoPage: {
          path: 'moving-yes-no',
          title: CONTACT_INFORMATION_CHAPTER_CONSTANTS.movingYesNoPageTitle,
          uiSchema: movingYesNoPage.uiSchema,
          schema: movingYesNoPage.schema,
        },
        newAddressPage: {
          depends: formData => formData.isMoving,
          path: 'new-address',
          title: CONTACT_INFORMATION_CHAPTER_CONSTANTS.newAddressPageTitle,
          uiSchema: newAddressPage.uiSchema,
          schema: newAddressPage.schema,
        },
        phoneAndEmailPage: {
          path: 'phone-and-email',
          title: CONTACT_INFORMATION_CHAPTER_CONSTANTS.phoneAndEmailPageTitle,
          uiSchema: phoneAndEmailPage.uiSchema,
          schema: phoneAndEmailPage.schema,
        },
      },
    },
  },
  getHelp,
  footerContent,
};

export default formConfig;
