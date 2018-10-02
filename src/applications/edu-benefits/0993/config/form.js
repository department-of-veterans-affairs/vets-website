import _ from 'lodash/fp';

import fullSchema0993 from 'vets-json-schema/dist/22-0993-schema.json';
import fullNameUI from '../../../../platform/forms/definitions/fullName';
import ssnUI from 'us-forms-system/lib/js/definitions/ssn';

import environment from '../../../../platform/utilities/environment';
import PrefillMessage from '../../../../platform/forms/save-in-progress/PrefillMessage';
import FormFooter from '../../../../platform/forms/components/FormFooter';

import GetFormHelp from '../../components/GetFormHelp';
import preSubmitInfo from '../../../../platform/forms/preSubmitInfo';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { prefillTransformer, tabIndexedTitle, transform } from '../helpers';

const { fullName } = fullSchema0993.definitions;
const {
  claimantSocialSecurityNumber,
  vaFileNumber,
} = fullSchema0993.properties;

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/0993`,
  trackingPrefix: 'edu-0993',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-0993',
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound:
      'Please start over to apply to opt out of sharing VA education benefits information.',
    noAuth:
      'Please sign in again to continue your application to opt out of sharing VA education benefits information.',
  },
  transformForSubmit: transform,
  title: 'Opt Out of Sharing VA Education Benefits Information',
  subTitle: 'VA Form 22-0993',
  preSubmitInfo,
  getHelp: GetFormHelp,
  footerContent: FormFooter,
  defaultDefinitions: {
    ...fullSchema0993.definitions,
  },
  chapters: {
    claimantInformation: {
      title: 'Applicant Information',
      pages: {
        claimantInformation: {
          title: 'Applicant Information',
          path: 'claimant-information',
          initialData: {
            // claimantFullName: {
            //   first: 'test',
            //   last: 'test'
            // },
            // claimantSocialSecurityNumber: '234234234'
          },
          uiSchema: {
            'ui:description': PrefillMessage,
            claimantFullName: _.merge(fullNameUI, {
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
            }),
            claimantSocialSecurityNumber: _.assign(ssnUI, {
              'ui:required': formData => !formData['view:noSSN'],
              'ui:title': 'Your Social Security number',
            }),
            'view:noSSN': {
              'ui:title': 'I don’t have a Social Security number',
              'ui:options': {
                hideOnReview: true,
              },
            },
            vaFileNumber: {
              'ui:required': formData => formData['view:noSSN'],
              'ui:title': 'Your VA file number',
              'ui:options': {
                expandUnder: 'view:noSSN',
              },
              'ui:errorMessages': {
                pattern: 'Your VA file number must be between 7 to 9 digits',
              },
            },
            'view:optOutMessage': {
              'ui:field': () =>
                tabIndexedTitle(
                  'By clicking the Continue button, you’re asking VA to not share your education benefits information.',
                ),
            },
          },
          schema: {
            type: 'object',
            properties: {
              claimantFullName: {
                type: 'object',
                required: ['first', 'last'],
                properties: fullName.properties,
              },
              claimantSocialSecurityNumber,
              'view:noSSN': {
                type: 'boolean',
              },
              vaFileNumber,
              'view:optOutMessage': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
