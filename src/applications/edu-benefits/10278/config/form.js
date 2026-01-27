import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import prefillTransform from './prefillTransform';

import {
  thirdPartyPersonName,
  thirdPartyPersonAddress,
  discloseInformation,
  securitySetup,
  securitySetupPinPassword,
  securitySetupCustomQuestion,
  securitySetupMotherBornLocation,
  securitySetupHighSchool,
  securitySetupPetName,
  securitySetupTeacherName,
  securitySetupFatherMiddleName,
} from '../pages';

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
  useCustomScrollAndFocus: true,
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
  prefillTransformer: prefillTransform,
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  customText: {
    appType: 'application',
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
        ...personalInformationPage({
          personalInfoConfig: {
            name: { show: true, required: true },
            ssn: { show: true, required: true },
            dateOfBirth: { show: true, required: true },
          },
          dataAdapter: {
            ssnPath: 'ssn',
          },
          depends: formData => formData?.userLoggedIn === true,
        }),
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
          depends: formData => formData?.userLoggedIn !== true,
        },
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
          depends: formData => formData?.userLoggedIn !== true,
        },
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    disclosureChapter: {
      title: 'Type of third party',
      pages: {
        discloseInformation: {
          path: 'type-of-third-party',
          title: 'Disclose your personal information to a third party',
          uiSchema: discloseInformation.uiSchema,
          schema: discloseInformation.schema,

          onNavForward: ({ formData, goPath }) => {
            if (formData?.discloseInformation?.authorize === 'organization') {
              //  go straight into add flow (hides summary until after first item)
              goPath('/authorized-organizations/0?add=true');
              return;
            }

            // person flow (use your actual person page path)
            goPath('/third-party-person-details');
          },
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
          depends: formData =>
            formData?.discloseInformation?.authorize === 'person',
        },
        thirdPartyPersonAddress: {
          path: 'third-party-person-details-1',
          title: 'Address of person',
          uiSchema: thirdPartyPersonAddress.uiSchema,
          schema: thirdPartyPersonAddress.schema,
          depends: formData =>
            formData?.discloseInformation?.authorize === 'person',
        },
      },
    },
    securitySetupChapter: {
      title: 'Security setup',
      pages: {
        securitySetup: {
          path: 'security-setup',
          title: 'Security setup',
          uiSchema: securitySetup.uiSchema,
          schema: securitySetup.schema,
          onNavForward: ({ formData, goPath }) => {
            const question = formData?.securityQuestion?.question;
            if (question === 'pin') {
              goPath('/security-setup-pin-password');
            } else if (question === 'create') {
              goPath('/security-setup-custom-question');
            } else if (question === 'motherBornLocation') {
              goPath('/security-setup-mother-born-location');
            } else if (question === 'highSchool') {
              goPath('/security-setup-high-school');
            } else if (question === 'petName') {
              goPath('/security-setup-pet-name');
            } else if (question === 'teacherName') {
              goPath('/security-setup-teacher-name');
            } else if (question === 'fatherMiddleName') {
              goPath('/security-setup-father-middle-name');
            }
          },
        },
        securitySetupPinPassword: {
          path: 'security-setup-pin-password',
          title: 'Security setup',
          uiSchema: securitySetupPinPassword.uiSchema,
          schema: securitySetupPinPassword.schema,
          depends: formData => formData?.securityQuestion?.question === 'pin',
          onNavBack: ({ goPath }) => {
            goPath('/security-setup');
          },
        },
        securitySetupCustomQuestion: {
          path: 'security-setup-custom-question',
          title: 'Security setup',
          uiSchema: securitySetupCustomQuestion.uiSchema,
          schema: securitySetupCustomQuestion.schema,
          depends: formData =>
            formData?.securityQuestion?.question === 'create',
          onNavBack: ({ goPath }) => {
            goPath('/security-setup');
          },
        },
        securitySetupMotherBornLocation: {
          path: 'security-setup-mother-born-location',
          title: 'Security setup',
          uiSchema: securitySetupMotherBornLocation.uiSchema,
          schema: securitySetupMotherBornLocation.schema,
          depends: formData =>
            formData?.securityQuestion?.question === 'motherBornLocation',
          onNavBack: ({ goPath }) => {
            goPath('/security-setup');
          },
        },
        securitySetupHighSchool: {
          path: 'security-setup-high-school',
          title: 'Security setup',
          uiSchema: securitySetupHighSchool.uiSchema,
          schema: securitySetupHighSchool.schema,
          depends: formData =>
            formData?.securityQuestion?.question === 'highSchool',
          onNavBack: ({ goPath }) => {
            goPath('/security-setup');
          },
        },
        securitySetupPetName: {
          path: 'security-setup-pet-name',
          title: 'Security setup',
          uiSchema: securitySetupPetName.uiSchema,
          schema: securitySetupPetName.schema,
          depends: formData =>
            formData?.securityQuestion?.question === 'petName',
          onNavBack: ({ goPath }) => {
            goPath('/security-setup');
          },
        },
        securitySetupTeacherName: {
          path: 'security-setup-teacher-name',
          title: 'Security setup',
          uiSchema: securitySetupTeacherName.uiSchema,
          schema: securitySetupTeacherName.schema,
          depends: formData =>
            formData?.securityQuestion?.question === 'teacherName',
          onNavBack: ({ goPath }) => {
            goPath('/security-setup');
          },
        },
        securitySetupFatherMiddleName: {
          path: 'security-setup-father-middle-name',
          title: 'Security setup',
          uiSchema: securitySetupFatherMiddleName.uiSchema,
          schema: securitySetupFatherMiddleName.schema,
          depends: formData =>
            formData?.securityQuestion?.question === 'fatherMiddleName',
          onNavBack: ({ goPath }) => {
            goPath('/security-setup');
          },
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
