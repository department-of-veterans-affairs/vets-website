import fullSchema from 'vets-json-schema/dist/28-8832-schema.json';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { hasSession } from 'platform/user/profile/utilities';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { statusSelection } from './chapters/status-selection';
import { veteranInformation } from './chapters/veteran-information';
import GetFormHelp from '../components/GetFormHelp';
import ReadOnlyUserDescription from '../components/ReadOnlyUserDescription';
import PreSubmitInfo from '../components/PreSubmitInfo';

import {
  claimantInformation,
  claimantAddress,
  staticClaimantInformation,
} from './chapters/claimant-information';
import { isDependent, transform } from './helpers';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_career_counseling_claims`,
  trackingPrefix: 'careers-employment-28-8832--',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  transformForSubmit: transform,
  formId: VA_FORM_IDS.FORM_28_8832,
  saveInProgress: {
    messages: {
      inProgress:
        'Your Personalized Career Planning and Guidance Chapter 36 benefit application is in progress.',
      expired:
        'Your saved Personalized Career Planning and Guidance Chapter 36 benefit application has expired. If you want to apply for PCPG Chapter 36 benefits, please start a new application.',
      saved: 'Your PCPG Chapter 36 benefits application has been saved.',
    },
  },
  version: 0,
  getHelp: GetFormHelp,
  preSubmitInfo: PreSubmitInfo,
  prefillEnabled: true,
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for Planning and career guidance.',
    noAuth:
      'Please sign in again to continue your application for Planning and career guidance.',
  },
  title:
    'Apply for Personalized Career Planning and Guidance with VA Form 28-8832',
  defaultDefinitions: { ...fullSchema.definitions },
  chapters: {
    claimantInformation: {
      title: 'Applicant Information',
      reviewDescription: ReadOnlyUserDescription,
      pages: {
        claimantInformation: {
          depends: () => !hasSession(),
          path: 'basic-information',
          title: 'Applicant Information',
          uiSchema: claimantInformation.uiSchema,
          schema: claimantInformation.schema,
        },
        claimantStaticInformation: {
          depends: () => hasSession(),
          path: 'claimant-information',
          title: 'Applicant Information',
          uiSchema: staticClaimantInformation.uiSchema,
          schema: staticClaimantInformation.schema,
        },
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
          title: 'Your sponsoring Veteran or service member',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
