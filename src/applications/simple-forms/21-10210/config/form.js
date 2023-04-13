// import fullSchema from 'vets-json-schema/dist/21-10210-schema.json';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';

import { CLAIM_OWNERSHIP, CLAIMANT_TYPE } from '../definitions/constants';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import statementInformation1 from '../pages/statementInformation1';
import statementInformation2 from '../pages/statementInformation2';
import witnessInformation1 from '../pages/witnessInformation1';
import witnessInformation2 from '../pages/witnessInformation2';
import claimantInformation1 from '../pages/claimantInformation1';
import claimantInformation2 from '../pages/claimantInformation2';
import veteranInformation1 from '../pages/veteranInformation1';
import veteranInformation2 from '../pages/veteranInformation2';
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
    witnessInformation: {
      // for third-party claimOwnership & non-veteran claimantType
      title: 'Witness Information',
      pages: {
        witnessInformation1: {
          path: 'witness-personal-information',
          title: 'Your personal information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIP.THIRD_PARTY,
            claimantType: CLAIMANT_TYPE.NON_VETERAN,
          },
          uiSchema: witnessInformation1.uiSchema,
          schema: witnessInformation1.schema,
        },
        witnessInformation2: {
          path: 'witness-contact-information',
          title: 'Your contact information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIP.THIRD_PARTY,
            claimantType: CLAIMANT_TYPE.NON_VETERAN,
          },
          uiSchema: witnessInformation2.uiSchema,
          schema: witnessInformation2.schema,
        },
      },
    },
    claimantInformation: {
      title: 'Claimant Information',
      pages: {
        claimantInformation1: {
          path: 'claimant-personal-information',
          title: 'Your personal information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIP.THIRD_PARTY,
            claimantType: CLAIMANT_TYPE.NON_VETERAN,
          },
          uiSchema: claimantInformation1.uiSchema,
          schema: claimantInformation1.schema,
        },
        claimantInformation2: {
          path: 'claimant-contact-information',
          title: 'Your contact information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIP.THIRD_PARTY,
            claimantType: CLAIMANT_TYPE.NON_VETERAN,
          },
          uiSchema: claimantInformation2.uiSchema,
          schema: claimantInformation2.schema,
        },
      },
    },
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation1: {
          path: 'veteran-personal-information',
          title: 'Veteran’s personal information',
          uiSchema: veteranInformation1.uiSchema,
          schema: veteranInformation1.schema,
        },
        veteranInformation2: {
          path: 'veteran-contact-information',
          title: 'Veteran’s contact information',
          uiSchema: veteranInformation2.uiSchema,
          schema: veteranInformation2.schema,
        },
      },
    },
  },
};

export default formConfig;
