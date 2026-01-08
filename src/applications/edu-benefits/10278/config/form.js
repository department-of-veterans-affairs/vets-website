import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';

import { thirdPartyPersonName, thirdPartyPersonAddress } from '../pages';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10278-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10278,
  saveInProgress: {
    messages: {
      inProgress: 'Your form (22-10278) is in progress.',
      expired:
        'Your saved form (22-10278) has expired. Please start a new form.',
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
  customText: {
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    startNewAppButtonText: 'Start a new form',
    finishAppLaterMessage: 'Finish this form later',
    appSavedSuccessfullyMessage: 'We’ve saved your form.',
    submitButtonText: 'Continue',
  },
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
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
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
      },
    },
    thirdPartyContactInformation: {
      title: 'Third party contact information',
      pages: {
        thirdPartyPersonName: {
          path: 'third-party-person-details',
          title: 'Name of person',
          uiSchema: thirdPartyPersonName.uiSchema,
          schema: thirdPartyPersonName.schema,
        },
        thirdPartyPersonAddress: {
          path: 'third-party-person-details-1',
          title: 'Address of person',
          uiSchema: thirdPartyPersonAddress.uiSchema,
          schema: thirdPartyPersonAddress.schema,
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
