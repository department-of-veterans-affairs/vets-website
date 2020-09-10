// import fullSchema from 'vets-json-schema/dist/HC-QSTNR-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import AppointmentInfoBox from '../components/AppointmentInfoBox';

import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/healthcare_questionnaire`,
  trackingPrefix: 'healthcare-questionnaire',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_HC_QSTNR,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Upcoming Visit questionnaire.',
    noAuth:
      'Please sign in again to continue your application for Upcoming Visit questionnaire.',
  },
  title: 'Healthcare Questionnaire',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: "Veteran's Information",
      pages: {
        demographicsPage: {
          path: 'demographics',
          hideHeaderRow: true,
          title: 'Veteran Information',
          uiSchema: {
            'view:veteranInfo': {
              'ui:field': AppointmentInfoBox,
              'ui:reviewField': AppointmentInfoBox,
              'ui:options': {
                viewComponent: AppointmentInfoBox,
              },
              seen: {},
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:veteranInfo': {
                type: 'object',
                properties: {
                  seen: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
