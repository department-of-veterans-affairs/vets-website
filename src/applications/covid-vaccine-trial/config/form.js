// import fullSchema from 'vets-json-schema/dist/covid-vaccine-trial-schema.json';
import fullSchema from '../schema/covid-vaccine-trial-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const formFields = {
  firstName: 'firstName',
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'covid-vaccine-trial-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '12345',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for vaccine trial participation.',
    noAuth:
      'Please sign in again to continue your application for vaccine trial participation.',
  },
  title: 'Covid Vaccine Trial',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Personal Information',
      pages: {
        page1: {
          path: 'covid-vaccine-trial',
          title: 'Personal Information - Page 1',
          uiSchema: {
            'ui:description': fullSchema.descriptionText, // todo - figure out how to get this to use formatting
            diagnosed: {
              'ui:title': fullSchema.yesNoQuestions.diagnosed,
              'ui:widget': 'yesNo',
            },
            hospitalized: {
              'ui:title': fullSchema.yesNoQuestions.hospitalized,
              'ui:widget': 'yesNo',
            },
            smokeOrVape: {
              'ui:title': fullSchema.yesNoQuestions.smokeOrVape,
              'ui:widget': 'yesNo',
            },
            healthHistory:
              fullSchema.multiQuestions.healthHistory.healthHistoryUISchema,
            employmentStatus:
              fullSchema.multiQuestions.employmentStatus
                .employmentStatusUISchema,
            transportation:
              fullSchema.multiQuestions.transportation.transportationUISchema,
            residents: fullSchema.multiQuestions.residents.residentsUISchema,
            closeContact:
              fullSchema.multiQuestions.closeContact.closeContactUISchema,
            [formFields.firstName]: {
              'ui:title': 'First Name',
            },
          },
          schema: {
            required: [formFields.firstName],
            type: 'object',
            properties: {
              diagnosed: {
                type: 'boolean',
              },
              hospitalized: {
                type: 'boolean',
              },
              smokeOrVape: {
                type: 'boolean',
              },
              healthHistory:
                fullSchema.multiQuestions.healthHistory.healthHistorySchema,
              employmentStatus:
                fullSchema.multiQuestions.employmentStatus
                  .employmentStatusSchema,
              transportation:
                fullSchema.multiQuestions.transportation.transportationSchema,
              residents: fullSchema.multiQuestions.residents.residentsSchema,
              closeContact:
                fullSchema.multiQuestions.closeContact.closeContactSchema,
              [formFields.firstName]: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
