// import fullSchema from 'vets-json-schema/dist/686-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'complaint-tool',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '686',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for declaration of status of dependents.',
    noAuth: 'Please sign in again to continue your application for declaration of status of dependents.'
  },
  title: 'Opt Out of Sharing VA Education Benefits Information',
  defaultDefinitions: {
  },
  chapters: {
    applicantInformation: {
      title: 'GI Bill School Complaint Tool',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: {
            onBehalfOf: {
              'ui:widget': 'radio',
              'ui:title': 'I’m filing on behalf of...'
            }
          },
          schema: {
            type: 'object',
            required: [
              'onBehalfOf',
            ],
            properties: {
              onBehalfOf: {
                type: 'string',
                'enum': [
                  'Myself',
                  'Someone else',
                  'I want to submit my complaint anonymously.'
                ]
              },
              fullName: {
                type: 'object',
                properties: {
                  // prefix: {
                  //   type: 'string',
                  //   'enum': [
                  //     'Mr.',
                  //     'Mrs.',
                  //     'Ms.',
                  //     'Dr.',
                  //     'Other'
                  //   ]
                  // },
                  first: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 15
                  },
                  middle: {
                    type: 'string',
                    maxLength: 15
                  },
                  last: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 25
                  },
                  suffix: {
                    type: 'string',
                    'enum': [
                      'Jr.',
                      'Sr.',
                      'II',
                      'III',
                      'IV'
                    ]
                  }
                },
                required: [
                  'first',
                  'last'
                ]
              },
              dob: {
                type: 'string',
                format: 'date'
              },
              serviceAffiliation: {
                type: 'string',
                'enum': [
                  'Service Member',
                  'Spouse or Family Member',
                  'Veteran',
                  'Other'
                ]
              },
            }
          }
        }
      }
    }
  }
};

export default formConfig;
