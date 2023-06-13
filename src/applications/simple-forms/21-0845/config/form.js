// import fullSchema from 'vets-json-schema/dist/21-0845-schema.json';
import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import { AUTHORIZER_TYPES } from '../definitions/constants';
// pages
import authTypePg from '../pages/authType';
import vetPersInfoPg from '../pages/vetPersInfo';

// mock-data import for local development
// import the appropriate file [flow?.json] for the flow you're working on, or
// noStmtInfo.json for all flows [select claimOwnership & claimantType via UI]
import testData from '../tests/fixtures/data/test-data.json';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const mockData = testData.data;
/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'auth-disclose-0845',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-0845',
  // dev: {
  //   showNavLinks: true,
  // },
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your disclosure authorization application (21-0845) is in progress.',
    //   expired: 'Your saved disclosure authorization application (21-0845) has expired. If you want to apply for disclosure authorization, please start a new application.',
    //   saved: 'Your disclosure authorization application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for disclosure authorization.',
    noAuth:
      'Please sign in again to continue your application for disclosure authorization.',
  },
  title: 'Authorize VA to disclose personal information to a third party',
  subTitle:
    'Authorization To Disclose Personal Information To a Third Party (VA Form 21-0845)',
  defaultDefinitions: {
    privacyAgreementAccepted: {
      type: 'boolean',
      enum: [true],
    },
  },
  chapters: {
    authorizerTypeChapter: {
      hideFormNavProgress: true,
      title: 'Who’s submitting this authorization?',
      pages: {
        authTypePage: {
          path: 'authorizer-type',
          title: 'Who’s submitting this authorization?',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData:
            !!mockData && environment.isLocalhost() ? mockData : undefined,
          uiSchema: authTypePg.uiSchema,
          schema: authTypePg.schema,
        },
      },
    },
    veteranPersonalInfoChapter: {
      title: ({ formData }) =>
        formData?.authorizerType === AUTHORIZER_TYPES.VETERAN
          ? 'Your personal information'
          : 'Veteran’s personal information',
      pages: {
        vetPersInfoPage: {
          path: 'veteran-personal-information',
          title: 'Your personal information',
          uiSchema: vetPersInfoPg.uiSchema,
          schema: vetPersInfoPg.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
  customText: {
    appType: 'authorization',
  },
};

export default formConfig;
