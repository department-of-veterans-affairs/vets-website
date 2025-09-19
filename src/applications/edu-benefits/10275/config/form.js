import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { agreementType, institutionDetailsFacility } from '../pages';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10275-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10275,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-10275) is in progress.',
    //   expired: 'Your saved education benefits application (22-10275) has expired. If you want to apply for education benefits, please start a new application.',
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
  customText: {
    appType: 'form',
  },
  defaultDefinitions: {},
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
  },
  // getHelp,
  footerContent,
};

export default formConfig;
