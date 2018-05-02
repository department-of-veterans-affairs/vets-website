// import fullSchema from 'vets-json-schema/dist/686-schema.json';
import _ from 'lodash/fp';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import fullSchema686 from 'vets-json-schema/dist/21-686C-schema.json';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import * as address from '../../../common/schemaform/definitions/address';

import ssnOrVaUI from '../../../common/schemaform/definitions/ssnOrVafile';
import { relationshipLabels } from '../helpers';

const { claimantEmail, claimantFullName, veteranFullName } = fullSchema686.properties;

const { ssn, fullName } = fullSchema686.definitions;

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
            veteranFullName: fullNameUI,
            ssnOrVa: _.merge({}, ssnOrVaUI, {
              'ui:errorMessages': {
                pattern: 'Your VA file number must be between 7 to 9 digits'
              }
            }),
            'view:relationship': {
              'ui:title': 'Relationship to Veteran',
              'ui:widget': 'radio',
              'ui:options': {
                labels: relationshipLabels
              }
            },
            'view:applicantInfo': {
              'ui:title': 'Applicant Information',
              claimantFullName: _.merge(fullNameUI, {
                first: {
                  'ui:required': (formData) => formData['view:relationship'] !== 'veteran'
                },
                last: {
                  'ui:required': (formData) => formData['view:relationship'] !== 'veteran'
                }
              }),
              ssn: _.assign(ssnUI, {
                'ui:required': (formData) => formData['view:relationship'] !== 'veteran'
              }),
              address: address.uiSchema('', false, (formData) => {
                return formData['view:relationship'] !== 'veteran';
              }),
              claimantEmail: {
                'ui:title': 'Email address',
                'ui:required': (formData) => formData['view:relationship'] !== 'veteran'
              },
              'ui:options': {
                expandUnder: 'view:relationship',
                expandUnderCondition: (field) => field === 'spouse' || field === 'child' || field === 'other'
              }
            },
          },
          schema: {
            type: 'object',
            required: ['ssnOrVa', 'view:relationship'],
            properties: {
              veteranFullName,
              ssnOrVa: {
                type: 'string',
              },
              'view:relationship': {
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
                  claimantFullName,
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
