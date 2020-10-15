import fullSchema from 'vets-json-schema/dist/28-8832-schema.json';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { hasSession } from 'platform/user/profile/utilities';

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
  trackingPrefix: '28-8832-planning-and-career-guidance-',
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
  savedFormMessages: {
    notFound: 'Please start over to apply for Planning and career guidance.',
    noAuth:
      'Please sign in again to continue your application for Planning and career guidance.',
  },
  title: '28-8832-planning-and-guidance',
  defaultDefinitions: { ...fullSchema.definitions },
  chapters: {
    claimantInformation: {
      title: 'Claimant Information',
      reviewDescription: ReadOnlyUserDescription,
      pages: {
        claimantInformation: {
          depends: () => !hasSession(),
          path: 'basic-information',
          title: 'Claimant Information',
          uiSchema: claimantInformation.uiSchema,
          schema: claimantInformation.schema,
        },
        claimantStaticInformation: {
          depends: () => hasSession(),
          path: 'claimant-information',
          title: 'Claimant Information',
          uiSchema: staticClaimantInformation.uiSchema,
          schema: staticClaimantInformation.schema,
        },
        claimantAddress: {
          path: 'claimant-address',
          title: 'Claimant Address',
          uiSchema: claimantAddress.uiSchema,
          schema: claimantAddress.schema,
        },
        statusSelection: {
          path: 'status-selection',
          title: 'Claimant Status',
          uiSchema: statusSelection.uiSchema,
          schema: statusSelection.schema,
        },
      },
    },
    veteranInformation: {
      title: 'Veteran or service member information',
      pages: {
        veteranInformation: {
          depends: formData => isDependent(formData),
          path: 'veteran-information',
          title: 'Veteran or service member information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
