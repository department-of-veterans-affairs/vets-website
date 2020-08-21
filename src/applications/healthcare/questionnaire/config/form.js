// import fullSchema from 'vets-json-schema/dist/HC-QSTNR-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import AppointmentInfoBox from '../components/AppointmentInfoBox';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'healthcare-questionnaire',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'HC-QSTNR',
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
