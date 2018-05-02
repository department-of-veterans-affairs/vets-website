// import fullSchema from 'vets-json-schema/dist/686-schema.json';
import _ from 'lodash';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import fullSchema686 from 'vets-json-schema/dist/21-686C-schema.json';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import * as address from '../../../common/schemaform/definitions/address';

import ssnOrVaUI from '../../../common/schemaform/definitions/ssnOrVafile';
import { relationshipLabels } from '../helpers';

const { claimantEmail } = fullSchema686.properties;

const { fullName, ssn } = fullSchema686.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '686-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-686C',
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: 'Please start over to apply for declaration of status of dependents.',
    noAuth: 'Please sign in again to continue your application for declaration of status of dependents.'
  },
  title: 'Declaration of status of dependents',
  defaultDefinitions: {
    fullName,
    ssn
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: {
            fullName: fullNameUI,
            ssnOrVa: _.merge({}, ssnOrVaUI, {
              'ui:title': 'Social Security number or VA file number',
              'ui:errorMessages': {
                pattern: 'Your VA file number must be between 7 to 9 digits'
              }
            }),
            relationship: {
              'ui:title': 'Relationship to Veteran',
              'ui:widget': 'radio',
              'ui:options': {
                labels: relationshipLabels
              }
            },
            'view:applicantInfo': {
              fullName: {
                'ui:title': 'Applicant Information',
                first: {
                  'ui:title': 'First name',
                  'ui:required': (field) => field.relationship !== 'veteran'
                },
                last: {
                  'ui:title': 'Last name',
                  'ui:required': (field) => field.relationship !== 'veteran'
                },
                middle: {
                  'ui:title': 'Middle name'
                },
                suffix: {
                  'ui:title': 'Suffix',
                  'ui:options': {
                    widgetClassNames: 'form-select-medium'
                  }
                }
              },
              ssn: _.assign(ssnUI, {
                'ui:title': 'Social Security number',
                'ui:required': (field) => field.relationship !== 'veteran'
              }),
              address: address.uiSchema('', false, (formData) => formData.relationship !== 'veteran'),
              claimantEmail: {
                'ui:title': 'Email address',
                'ui:required': (field) => field.relationship !== 'veteran'
              },
              'ui:options': {
                expandUnder: 'relationship',
                expandUnderCondition: (field) => field === 'spouse' || field === 'child' || field === 'other'
              }
            },
          },
          schema: {
            type: 'object',
            required: ['ssnOrVa', 'relationship'],
            properties: {
              fullName,
              ssnOrVa: {
                type: 'string',
              },
              relationship: {
                type: 'string',
                'enum': [
                  'veteran',
                  'spouse',
                  'child',
                  'other'
                ]
              },
              'view:applicantInfo': {
                type: 'object',
                properties: {
                  fullName: {
                    type: 'object',
                    properties: {
                      first: {
                        type: 'string'
                      },
                      last: {
                        type: 'string'
                      },
                      middle: {
                        type: 'string'
                      },
                      suffix: {
                        type: 'string'
                      }
                    }
                  },
                  ssn,
                  address: address.schema(fullSchema686),
                  claimantEmail
                }
              },
            }
          },
        }
      }
    }
  }
};

export default formConfig;
