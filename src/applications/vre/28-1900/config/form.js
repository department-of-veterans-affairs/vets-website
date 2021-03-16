import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import environment from 'platform/utilities/environment';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PreSubmitInfo from 'applications/vre/28-1900/components/PreSubmitInfo';
import { additionalInformation } from './chapters/additional-information';
import { communicationPreferences } from './chapters/communication-preferences';
import { veteranInformation, veteranAddress } from './chapters/veteran';
import StaticInformationReviewField from '../containers/StaticInformationReviewField';
import GetFormHelp from 'applications/vre/components/GetFormHelp';
import { transform } from './helpers';
import { WIZARD_STATUS } from '../constants';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/veteran_readiness_employment_claims`,
  trackingPrefix: 'careers-employment-28-1900--',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: PreSubmitInfo,
  transformForSubmit: transform,
  formId: '28-1900',
  wizardStorageKey: WIZARD_STATUS,
  saveInProgress: {
    messages: {
      inProgress:
        'Your VR&E Chapter 31 benefits application (28-1900) is in progress.',
      expired:
        'Your saved VR&E Chapter 31 benefits application (28-1900) has expired. If you want to apply for Chapter 31 benefits, please start a new application.',
      saved: 'Your Chapter 31 benefits application has been saved.',
    },
  },
  version: 0,
  getHelp: GetFormHelp,
  prefillEnabled: true,
  // TODO: Currently if a user is logged in, veteran information does NOT get sent to the backend with the payload. We can either add it in
  // transformForSubmit, OR add it once the payload reaches vets-api.
  savedFormMessages: {
    notFound:
      'Please start over to apply for Veteran Readiness and Employment.',
    noAuth:
      'Please sign in again to continue your application for Vocational Readiness and Employment.',
  },
  title: 'Apply for Veteran Readiness and Employment with VA Form 28-1900',
  defaultDefinitions: { ...fullSchema.definitions },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      reviewDescription: StaticInformationReviewField,
      pages: {
        // TODO: possibly add this back in once issue has been investigated.
        // veteranStaticInformation: {
        //   depends: () => hasSession(),
        //   path: 'veteran-information-review',
        //   title: 'Veteran Information Review',
        //   hideHeaderRow: true,
        //   schema: {
        //     type: 'object',
        //     properties: {},
        //   },
        //   uiSchema: {
        //     'ui:description': VeteranInformationViewComponent,
        //     'ui:reviewField': StaticInformationReviewField,
        //   },
        // },
        veteranInformation: {
          path: 'veteran-information-review',
          title: 'Veteran Information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        contactInformation: {
          path: 'veteran-contact-information',
          title: 'Veteran Contact Information',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
      },
    },
    additionalInformation: {
      title: 'Additional Information',
      pages: {
        additionalInformation: {
          path: 'additional-information',
          title: 'Additional Information',
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
      },
    },
    communicationPreferences: {
      title: 'Communication Preferences',
      pages: {
        communicationPreferences: {
          path: 'communication-preferences',
          title: 'VR&E Communication Preferences',
          uiSchema: communicationPreferences.uiSchema,
          schema: communicationPreferences.schema,
        },
      },
    },
  },
};

export default formConfig;
