import _ from 'lodash/fp';

import fullSchema0993 from 'vets-json-schema/dist/22-0993-schema.json';

import applicantInformation from '../../../../platform/forms/pages/applicantInformation';
import PrefillMessage from '../../../../platform/forms/save-in-progress/PrefillMessage';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { prefillTransformer } from '../helpers';

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
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
  defaultDefinitions: {
    ...fullSchema0993.definitions
  },
  chapters: {
    form: {
      title: 'Form',
      pages: {
        applicantInformation: _.merge(applicantInformation(fullSchema0993, {
          isVeteran: true,
          fields: [
            'veteranFullName',
            'veteranSocialSecurityNumber',
            'view:noSSN',
            'vaFileNumber',
            'view:signature'
          ],
          required: [
            'veteranFullName'
          ]
        }), {
          initialData: {
            // verified: true
          },
          uiSchema: {
            'ui:description': PrefillMessage,
            veteranFullName: {
              first: {
                'ui:title': 'Your first name'
              },
              last: {
                'ui:title': 'Your last name'
              },
              middle: {
                'ui:title': 'Your middle name'
              },
              'ui:options': {
                hideIf: (formData) => formData.verified
              }
            },
            veteranSocialSecurityNumber: {
              'ui:options': {
                hideIf: (formData) => formData.verified
              }
            },
            'view:noSSN': {
              'ui:options': {
                hideIf: (formData) => formData.verified
              }
            },
            vaFileNumber: {
              'ui:options': {
                hideIf: (formData) => formData.verified
              }
            },
            'view:signature': {
              'ui:title': 'By clicking this form you are electing to opt out of information sharing.',
              'ui:description': 'Submitting this form serves as your signature.'
            }
          },
          schema: {
            properties: {
              'view:signature': {
                type: 'object',
                properties: {}
              }
            }
          }
        })
      }
    }
  }
};

export default formConfig;
