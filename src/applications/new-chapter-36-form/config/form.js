import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  TITLE,
  SUBTITLE,
  VET_SM_INFO_CHAPTER_CONSTANTS,
  YOUR_INFORMATION_CHAPTER_CONSTANTS,
} from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import claimantAddressPage from '../pages/claimantAddress';
import veteranAddressPage from '../pages/veteranAddress';
import veteranServiceMemberInfoPage from '../pages/veteranServiceMemberInfo';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'careers-employment-27-8832-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  stepLabels:
    'Your information;Veteran or service member information;Military history;Review',
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_27_8832,
  formOptions: {
    useWebComponentForNavigation: true,
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your Personalized Career Planning and Guidance Chapter 36 benefit application is in progress.',
      expired:
        'Your saved Personalized Career Planning and Guidance Chapter 36 benefit application has expired. If you want to apply for PCPG Chapter 36 benefits, start a new application.',
      saved: 'Your PCPG Chapter 36 benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for personalized career planning and guidance.',
    noAuth:
      'Please sign in again to continue your application for personalized career planning and guidance.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    veteranServiceMemberInfoChapter: {
      title: VET_SM_INFO_CHAPTER_CONSTANTS.chapterTitle,
      pages: {
        claimantAddressPage: {
          path: 'claimant-address',
          title: YOUR_INFORMATION_CHAPTER_CONSTANTS.claimantAddressPageTitle,
          uiSchema: claimantAddressPage.uiSchema,
          schema: claimantAddressPage.schema,
        },
        veteranServiceMemberInfoPage: {
          path: 'vet-sm-info',
          title:
            VET_SM_INFO_CHAPTER_CONSTANTS.veteranServiceMemberInfoPageTitle,
          uiSchema: veteranServiceMemberInfoPage.uiSchema,
          schema: veteranServiceMemberInfoPage.schema,
        },
        veteranAddressPage: {
          path: 'veteran-address',
          title: VET_SM_INFO_CHAPTER_CONSTANTS.veteranAddressPageTitle,
          uiSchema: veteranAddressPage.uiSchema,
          schema: veteranAddressPage.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
