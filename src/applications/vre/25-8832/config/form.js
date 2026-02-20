import fullSchema from 'vets-json-schema/dist/28-8832-schema.json';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { statusSelection } from './chapters/status-selection';
import { veteranInformation } from './chapters/veteran-information';
import GetFormHelp from '../../components/GetFormHelp';
import PreSubmitInfo from '../components/PreSubmitInfo';

import {
  claimantInformation,
  claimantAddress,
} from './chapters/claimant-information';
import { isDependent, transform } from './helpers';
import manifest from '../manifest.json';

import { WIZARD_STATUS } from '../constants';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_career_counseling_claims`,
  trackingPrefix: 'careers-employment-28-8832--',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  transformForSubmit: transform,
  formId: VA_FORM_IDS.FORM_28_8832,
  wizardStorageKey: WIZARD_STATUS,
  customText: {
    appAction: 'applying for planning and career guidance',
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
  getHelp: GetFormHelp,
  preSubmitInfo: PreSubmitInfo,
  prefillEnabled: true,
  downtime: {
    dependencies: [
      externalServices.icmhs,
      externalServices.global,
      externalServices.mvi,
      externalServices.vaProfile,
      externalServices.vbms,
    ],
  },
  savedFormMessages: {
    notFound: 'Start over to apply for Planning and career guidance.',
    noAuth:
      'Sign in again to continue your application for Planning and career guidance.',
  },
  title: 'Apply for Personalized Career Planning and Guidance',
  subTitle: 'Form 27-8832 (formally known as 28-8832, or 25-8832)',
  defaultDefinitions: { ...fullSchema.definitions },
  chapters: {
    claimantInformation: {
      title: 'Applicant Information',
      // TODO: possibly re-added some time down later
      // reviewDescription: ReadOnlyUserDescription,
      pages: {
        claimantInformation: {
          path: 'claimant-information',
          title: 'Applicant Information',
          uiSchema: claimantInformation.uiSchema,
          schema: claimantInformation.schema,
        },
        // TODO: possibly re-added some time later
        // claimantStaticInformation: {
        //   depends: formData => {
        //     return formData.loa === LOA_LEVEL_REQUIRED;
        //   },
        //   path: 'claimant-information',
        //   title: 'Applicant Information',
        //   uiSchema: staticClaimantInformation.uiSchema,
        //   schema: staticClaimantInformation.schema,
        // },
        claimantAddress: {
          path: 'claimant-address',
          title: 'Applicant Address',
          uiSchema: claimantAddress.uiSchema,
          schema: claimantAddress.schema,
        },
        statusSelection: {
          path: 'status-selection',
          title: 'Applicant Status',
          uiSchema: statusSelection.uiSchema,
          schema: statusSelection.schema,
        },
      },
    },
    veteranInformation: {
      title: 'Your sponsoring Veteran or service member',
      pages: {
        veteranInformation: {
          depends: formData => isDependent(formData),
          path: 'veteran-information',
          title: 'Your sponsor’s information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
