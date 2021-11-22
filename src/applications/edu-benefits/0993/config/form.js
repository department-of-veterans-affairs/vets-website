import fullSchema0993 from 'vets-json-schema/dist/22-0993-schema.json';
import fullNameUI from 'platform/forms/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import environment from 'platform/utilities/environment';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import preSubmitInfo from 'platform/forms/preSubmitInfo';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { prefillTransformer, tabIndexedTitle, transform } from '../helpers';

import manifest from '../manifest.json';

const { fullName } = fullSchema0993.definitions;
const {
  claimantSocialSecurityNumber,
  vaFileNumber,
} = fullSchema0993.properties;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/0993`,
  trackingPrefix: 'edu-0993',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_0993,
  saveInProgress: {
    messages: {
      inProgress: 'Your opt out application (22-0993) is in progress.',
      expired:
        'Your saved opt out application (22-0993) has expired. If you want opt out, please start a new application.',
      saved: 'Your opt out application has been saved.',
    },
  },
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
  title: 'Opt out of sharing education benefits information',
  subTitle: 'Form 22-0993',
  preSubmitInfo,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  footerContent: FormFooter,
  defaultDefinitions: {
    ...fullSchema0993.definitions,
  },
  chapters: {
    claimantInformation: {
      title: 'Applicant information',
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
            claimantFullName: fullNameUI,
            claimantSocialSecurityNumber: {
              ...ssnUI,
              'ui:required': formData => !formData['view:noSSN'],
              'ui:title': 'Social Security number',
            },
            'view:noSSN': {
              'ui:title': 'I don’t have a Social Security number',
              'ui:options': {
                hideOnReview: true,
              },
            },
            vaFileNumber: {
              'ui:required': formData => formData['view:noSSN'],
              'ui:title': 'VA file number',
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
