// import fullSchema from 'vets-json-schema/dist/21-10210-schema.json';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';

import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../definitions/constants';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import claimOwnership from '../pages/claimOwnership';
import claimantType from '../pages/claimantType';
import witnessPersInfo from '../pages/witnessPersInfo';
import witnessContInfo from '../pages/witnessContInfo';
import claimantInformation1 from '../pages/claimantInformation1';
import claimantInformation2 from '../pages/claimantInformation2';
import vetPersInfo from '../pages/vetPersInfo';
import vetIdInfo from '../pages/vetIdInfo';
import vetAddrInfo from '../pages/vetAddrInfo';
import vetContInfo from '../pages/vetContInfo';
import statement from '../pages/statement';
// import { uiSchema as addressUiSchema } from 'src/platform/forms/definitions/address';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;

// "Flows" in comments below map to "Stories" in the mockups:
// https://www.sketch.com/s/a11421d3-c148-41a2-a34f-3d7821ea676f
// There are 4 Flows, based on claimOwnership & claimantType

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
    statementInfoChapter: {
      // for ALL Flows
      // claimOwnership & claimantType decide which Flow to render
      title: 'Who is submitting this statement?',
      hideFormNavProgress: true,
      pages: {
        claimOwnershipPage: {
          path: 'claim-ownership',
          title: 'Who is submitting this statement?',
          uiSchema: claimOwnership.uiSchema,
          schema: claimOwnership.schema,
        },
        claimantTypePage: {
          path: 'claimant-type',
          title: 'Who is submitting this statement?',
          uiSchema: claimantType.uiSchema,
          schema: claimantType.schema,
        },
      },
    },
    witnessPersonalInfoChapter: {
      // for Flow 4: 3rd-party claim & non-vet claimant
      title: 'Your personal information',
      pages: {
        witnessPersonalInfoPage: {
          path: 'witness-personal-information',
          title: 'Your personal information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          uiSchema: witnessPersInfo.uiSchema,
          schema: witnessPersInfo.schema,
        },
      },
    },
    witnessContactInfoChapter: {
      // for Flow 4: 3rd-party claim & non-vet claimant
      title: 'Your contact information',
      pages: {
        witnessContactInfoPage: {
          path: 'witness-contact-information',
          title: 'Your contact information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          uiSchema: witnessContInfo.uiSchema,
          schema: witnessContInfo.schema,
        },
      },
    },
    claimantInformation: {
      // for Flow 4: 3rd-party claim & non-vet claimant
      title: 'Claimant Information',
      pages: {
        claimantInformation1: {
          path: 'claimant-personal-information',
          title: 'Your personal information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          uiSchema: claimantInformation1.uiSchema,
          schema: claimantInformation1.schema,
        },
        claimantInformation2: {
          path: 'claimant-contact-information',
          title: 'Your contact information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          uiSchema: claimantInformation2.uiSchema,
          schema: claimantInformation2.schema,
        },
      },
    },
    veteranPersonalInfo: {
      // for All flows
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF &&
        formData.claimantType === CLAIMANT_TYPES.VETERAN
          ? 'Your personal information'
          : 'Veteran personal information',
      pages: {
        veteranPersonalInfo1: {
          path: 'veteran-personal-information',
          title: 'Veteran personal information',
          uiSchema: vetPersInfo.uiSchema,
          schema: vetPersInfo.schema,
        },
      },
    },
    veteranIdentificationInfo: {
      // for all claimOwnership/claimantType combos
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF &&
        formData.claimantType === CLAIMANT_TYPES.VETERAN
          ? 'Your identification information'
          : 'Veteran identification information',
      pages: {
        veteranIdentificationInfo1: {
          path: 'veteran-identification-information',
          title: 'Veteran identification information',
          uiSchema: vetIdInfo.uiSchema,
          schema: vetIdInfo.schema,
        },
      },
    },
    veteranMailingAddressInfo: {
      // for all claimOwnership/claimantType combos
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF &&
        formData.claimantType === CLAIMANT_TYPES.VETERAN
          ? 'Your mailing address'
          : 'Veteran mailing address',
      pages: {
        veteranMailingAddressInfo1: {
          path: 'veteran-mailing-address',
          title: 'Veteran mailing address',
          uiSchema: vetAddrInfo.uiSchema,
          schema: vetAddrInfo.schema,
        },
      },
    },
    veteranContactInfo: {
      // for all claimOwnership/claimantType combos
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF &&
        formData.claimantType === CLAIMANT_TYPES.VETERAN
          ? 'Your contact information'
          : 'Veteran contact information',
      pages: {
        veteranContactInfo1: {
          path: 'veteran-contact-information',
          title: 'Veteran contact information',
          uiSchema: vetContInfo.uiSchema,
          schema: vetContInfo.schema,
        },
      },
    },
    statement: {
      title: 'Your statement',
      pages: {
        statement: {
          path: 'statement',
          title: 'Please indicate the claimed issue that you are addressing',
          uiSchema: statement.uiSchema,
          schema: statement.schema,
        },
      },
    },
  },
};

export default formConfig;
