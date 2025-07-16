import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';
import { trainingProviderSummary } from '../pages/trainingProviderSummary';

import { trainingProviderArrayOptions } from '../helpers';
import { trainingProviderDetails } from '../pages/trainingProviderDetails';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10297',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10297,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-10297) is in progress.',
    //   expired: 'Your saved education benefits application (22-10297) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
      },
    },
    identificationChapter: {
      title: 'Veteran’s information',
      pages: {
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
      },
    },
    trainingProviderChapter: {
      title: 'Training provider details',
      pages: {
        ...arrayBuilderPages(trainingProviderArrayOptions, pageBuilder => ({
          trainingProviderSummary: pageBuilder.summaryPage({
            title: 'Tell us about your training provider',
            path: 'training-provider',
            uiSchema: trainingProviderSummary.uiSchema,
            schema: trainingProviderSummary.schema,
            // scrollAndFocusTarget,
          }),
          trainingProviderDetails: pageBuilder.itemPage({
            title: 'Training provider name and mail address',
            path: 'training-provider/:index/details',
            uiSchema: trainingProviderDetails.uiSchema,
            schema: trainingProviderDetails.schema,
          }),
        })),
        // isProprietaryProfit: {
        //   path: 'proprietary-profit',
        //   title: "Confirm your institution's classification",
        //   uiSchema: isProprietaryProfit.uiSchema,
        //   schema: isProprietaryProfit.schema,
        // },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
