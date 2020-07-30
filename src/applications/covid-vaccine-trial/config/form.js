import _ from 'lodash';

// import fullSchema from 'vets-json-schema/dist/covid-vaccine-trial-schema.json';
import fullSchema from '../schema/covid-vaccine-trial-schema.json';
import schemaDefinitions from 'vets-json-schema/dist/definitions.json';

import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

import fullNameUI from 'platform/forms/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import dataUtils from 'platform/utilities/data/index';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const { fullName } = schemaDefinitions;
const { get, omit, set } = dataUtils;

export function validateEmailsMatch(errors, pageData) {
  const { email, confirmEmail } = pageData;
  if (email !== confirmEmail) {
    errors.confirmEmail.addError('Please ensure your entries match');
  }
}
export function validatePhone(errors, pageData) {
  const { phone } = pageData;
  if (phone && !/\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/.test(phone)) {
    errors.phone.addError('Please enter a valid 10-digit phone number');
  }
}

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
            'view:contactInfoDescription': {
              'ui:description':
                'Your contact information (all fields required)',
            },
            'ui:validations': [validateEmailsMatch, validatePhone],
            fullName: _.merge(fullNameUI, {
              first: {
                'ui:title': 'Your first name',
              },
              last: {
                'ui:title': 'Your last name',
              },
              middle: {
                'ui:title': 'Your middle name',
              },
              suffix: {
                'ui:title': 'Your suffix',
              },
              'ui:order': ['first', 'middle', 'last', 'suffix'],
            }),
            email: emailUI(),
            confirmEmail: emailUI('Confirm email address'),
            phone: phoneUI(),
          },
          schema: {
            required: ['phone'],
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
              'view:contactInfoDescription': {
                type: 'object',
                properties: {},
              },
              fullName: set('required', ['first', 'last'], fullName),
              email: {
                type: 'string',
                format: 'email',
              },
              confirmEmail: {
                type: 'string',
                format: 'email',
              },
              phone: {
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
