import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import environment from 'platform/utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import PreSubmitInfo from 'applications/vre/28-1900/components/PreSubmitInfo';
import GetFormHelp from 'applications/vre/components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { additionalInformation } from './chapters/additional-information';
import { communicationPreferences } from './chapters/communication-preferences';
import { veteranInformation, veteranAddress } from './chapters/veteran';
import { transform } from './helpers';
import { WIZARD_STATUS } from '../constants';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/veteran_readiness_employment_claims`,
  trackingPrefix: 'careers-employment-28-1900-',
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
        'Your saved VR&E Chapter 31 benefits application (28-1900) has expired. If you want to apply for Chapter 31 benefits, start a new application.',
      saved: 'Your Chapter 31 benefits application has been saved.',
    },
  },
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      externalServices.mvi,
      externalServices.vaProfile,
      externalServices.vbms,
      externalServices.vre,
      externalServices.global,
    ],
  },
  version: 0,
  getHelp: GetFormHelp,
  prefillEnabled: true,
  // TODO: Currently if a user is logged in, veteran information does NOT get sent to the backend with the payload. We can either add it in
  // transformForSubmit, OR add it once the payload reaches vets-api.
  savedFormMessages: {
    notFound: 'Start over to apply for Veteran Readiness and Employment.',
    noAuth:
      'Sign in again to continue your application for Vocational Readiness and Employment.',
  },
  title: 'Apply for Veteran Readiness and Employment with VA Form 28-1900',
  defaultDefinitions: { ...fullSchema.definitions },
  chapters: {
    veteranInformation: {
      title: 'Applicant information',
      // TODO: related to the comment direcly below; add reviewDescription back in once the issues with static veteran information have been resolved.
      // reviewDescription: StaticInformationReviewField,
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
          title: 'Veteran information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        contactInformation: {
          path: 'veteran-contact-information',
          title: 'Veteran contact information',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
      },
    },
    additionalInformation: {
      title: 'Additional information',
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
      title: 'Communication preferences',
      pages: {
        communicationPreferences: {
          path: 'communication-preferences',
          title: 'VR&E communication preferences',
          uiSchema: communicationPreferences.uiSchema,
          schema: communicationPreferences.schema,
        },
      },
    },
  },
};

export default formConfig;
