import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import submitForm from './submitForm';
import transform from './submit-transformer';
import { TITLE, SUBTITLE, SUBMIT_URL } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PrivacyPolicy from '../components/PrivacyPolicy';

import {
  agreementType,
  institutionDetailsFacility,
  authorizingOfficial,
  newAuthorizingOfficial,
} from '../pages';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitForm,
  trackingPrefix: 'edu-10275-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10275,
  saveInProgress: {
    messages: {
      inProgress: 'Your form (22-10275) is in progress.',
      expired:
        'Your saved form (22-10275) has expired. Please start a new form.',
      saved: 'Your form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  preSubmitInfo: {
    statementOfTruth: {
      heading: 'Certification statement',
      body: PrivacyPolicy,
      messageAriaDescribedby: 'I have read and accept the privacy policy.',
      fullNamePath: 'authorizingOfficial.fullName',
    },
  },
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
  defaultDefinitions: {},
  transformForSubmit: transform,
  chapters: {
    agreementTypeChapter: {
      title: 'Agreement type',
      pages: {
        agreementType: {
          path: 'agreement-type',
          title: 'Agreement type',
          uiSchema: agreementType.uiSchema,
          schema: agreementType.schema,
          onContinue: (data, setFormData) => {
            const hasCode = !!data?.institutionDetails?.facilityCode?.trim();
            if (hasCode) {
              setFormData({
                ...data,
                institutionDetails: {
                  ...data.institutionDetails,
                  facilityCode: '',
                  institutionName: undefined,
                  institutionAddress: {},
                  poeEligible: undefined,
                },
              });
            }
          },
        },
      },
    },
    newCommitmentChapter: {
      title: 'Institution details',
      pages: {
        institutionDetailsFacilityNew: {
          path: 'new-commitment-institution-details',
          title: 'Institution details',
          depends: data => data?.agreementType === 'newCommitment',
          uiSchema: institutionDetailsFacility.uiSchema,
          schema: institutionDetailsFacility.schema,
        },
      },
    },
    associatedOfficialsChapter: {
      title: 'Associated officials',
      pages: {
        authorizingOfficialNew: {
          path: 'new-commitment-authorizing-official',
          title: 'Your information',
          depends: data => data?.agreementType === 'newCommitment',
          uiSchema: newAuthorizingOfficial.uiSchema,
          schema: newAuthorizingOfficial.schema,
        },
      },
    },
    withdrawalChapter: {
      title: 'Institution details',
      pages: {
        institutionDetailsFacilityWithdrawal: {
          path: 'withdrawal-institution-details',
          title: 'Institution details',
          depends: data => data?.agreementType === 'withdrawal',
          uiSchema: institutionDetailsFacility.uiSchema,
          schema: institutionDetailsFacility.schema,
        },
      },
    },
    authorizingOfficialChapter: {
      title: 'Authorizing official',
      pages: {
        authorizingOfficial: {
          path: 'authorizing-official',
          title: 'Authorizing official',
          depends: data => data?.agreementType === 'withdrawal',
          uiSchema: authorizingOfficial.uiSchema,
          schema: authorizingOfficial.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
