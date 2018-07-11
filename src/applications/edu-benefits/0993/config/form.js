import _ from 'lodash/fp';

import fullSchema0993 from 'vets-json-schema/dist/22-0993-schema.json';
import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
import ssnUI from 'us-forms-system/lib/js/definitions/ssn';

import PrefillMessage from '../../../../platform/forms/save-in-progress/PrefillMessage';
import FormFooter from '../../../../platform/forms/components/FormFooter';

import GetFormHelp from '../../components/GetFormHelp';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { prefillTransformer } from '../helpers';

const { veteranSocialSecurityNumber, vaFileNumber } = fullSchema0993.properties;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () => Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '0993',
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply to opt out of sharing VA education benefits information.',
    noAuth: 'Please sign in again to continue your application to opt out of sharing VA education benefits information.'
  },
  title: 'Opt Out of Sharing VA Education Benefits Information',
  subTitle: 'VA Form 22-0993',
  getHelp: GetFormHelp,
  footerContent: FormFooter,
  defaultDefinitions: {
    ...fullSchema0993.definitions
  },
  chapters: {
    applicantInformation: {
      title: 'Form',
      pages: {
        applicantInformation: {
          path: 'applicant/information',
          title: 'Applicant information',
          initialData: {
            // verified: true,
            veteranFullName: {
              first: 'test',
              last: 'test'
            },
            veteranSocialSecurityNumber: '234234234'
          },
          uiSchema: {
            'ui:description': PrefillMessage,
            veteranFullName: _.merge(fullNameUI, {
              first: {
                'ui:title': 'Your first name',
                'ui:required': (formData) => !formData.verified
              },
              last: {
                'ui:title': 'Your last name',
                'ui:required': (formData) => !formData.verified
              },
              middle: {
                'ui:title': 'Your middle name'
              },
              suffix: {
                'ui:title': 'Your suffix'
              },
              'ui:options': {
                hideIf: (formData) => formData.verified
              }
            }),
            veteranSocialSecurityNumber: _.assign(ssnUI, {
              'ui:required': (formData) => !formData.verified && !formData['view:noSSN'],
              'ui:title': 'Your Social Security number',
              'ui:options': {
                hideIf: (formData) => formData.verified
              }
            }),
            'view:noSSN': {
              'ui:title': 'I don’t have a Social Security number',
              'ui:options': {
                hideOnReview: true,
                hideIf: (formData) => formData.verified
              }
            },
            vaFileNumber: {
              'ui:required': (formData) => !formData.verified && formData['view:noSSN'],
              'ui:title': 'Your VA file number',
              'ui:options': {
                hideIf: (formData) => formData.verified,
                expandUnder: 'view:noSSN'
              },
              'ui:errorMessages': {
                pattern: 'Your VA file number must be between 7 to 9 digits'
              }
            },
            'view:optOutMessage': {
              'ui:title': 'By clicking this form you are electing to opt out of information sharing.'
            }
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName: {
                type: 'object',
                properties: {
                  first: {
                    type: 'string'
                  },
                  middle: {
                    type: 'string'
                  },
                  last: {
                    type: 'string'
                  },
                  suffix: {
                    type: 'string'
                  }
                }
              },
              veteranSocialSecurityNumber,
              'view:noSSN': {
                type: 'boolean'
              },
              vaFileNumber,
              'view:optOutMessage': {
                type: 'object',
                properties: {}
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
