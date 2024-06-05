// import fullSchema from 'vets-json-schema/dist/21A-schema.json';

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import GetFormHelp from '../components/GetFormHelp';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import manifest from '../manifest.json';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;

const formConfig = {
  formId: VA_FORM_IDS.FORM_21A,
  version: 0,
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21a-',
  title: 'Apply to become a VA accredited attorney or claims agent',
  subTitle: 'VA Form 21a',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: '',
  prefillEnabled: true,
  saveInProgress: {
    messages: {
      inProgress:
        'Your application to become a VA accredited attorney or claims agent (21a) is in progress.',
      expired:
        'Your saved application to become a VA accredited attorney or claims agent (21a) has expired. If you want to apply to become a VA accredited attorney or claims agent, please start a new application.',
      saved:
        'Your application to become a VA accredited attorney or claims agent (21a) has been saved.',
    },
  },
  savedFormMessages: {
    notFound:
      'Please start over to apply to become a VA accredited attorney or claims agent.',
    noAuth:
      'Please sign in again to continue your application to become a VA accredited attorney or claims agent.',
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
    },
  },
  defaultDefinitions: {},
  chapters: {
    personalInformation: {
      title: 'Personal information',
      pages: {
        personalInformation: {
          title: 'Personal information',
          path: 'personal-information',
          uiSchema: {
            fullName: fullNameUI(),
            dateOfBirth: dateOfBirthUI(),
          },
          schema: {
            type: 'object',
            required: ['dateOfBirth'],
            properties: {
              fullName: fullNameSchema,
              dateOfBirth: dateOfBirthSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
