// import fullSchema from 'vets-json-schema/dist/21-10210-schema.json';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import statementInformation1 from '../pages/statementInformation1';
import statementInformation2 from '../pages/statementInformation2';
// import { uiSchema as addressUiSchema } from 'src/platform/forms/definitions/address';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'lay-witness-10210-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-10210',
  saveInProgress: {
    messages: {
      inProgress: 'Your claims application (21-10210) is in progress.',
      expired:
        'Your saved claims application (21-10210) has expired. If you want to apply for claims, please start a new application.',
      saved: 'Your claims application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    // notFound: 'Please start over to apply for claims.',
    // noAuth: 'Please sign in again to continue your application for claims.',
  },
  title: 'Submit a Lay/Witness Statement',
  subTitle: 'Equal to submitting a Lay/Witness Statement (VA Form 21-10210)',
  defaultDefinitions: {},
  chapters: {
    statementInformation: {
      title: 'Who is submitting this statement?',
      pages: {
        statementInformation1: {
          path: 'claim-ownership',
          title: 'Who is submitting this statement?',
          uiSchema: statementInformation1.uiSchema,
          schema: statementInformation1.schema,
        },
        statementInformation2: {
          path: 'claimant-type',
          title: 'Who is submitting this statement?',
          uiSchema: statementInformation2.uiSchema,
          schema: statementInformation2.schema,
        },
      },
    },
  },
};

export default formConfig;
