import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import getHelp from '../../shared/components/GetFormHelp';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../definitions/constants';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import claimOwnership from '../pages/claimOwnership';
import claimantType from '../pages/claimantType';
import witnessPersInfo from '../pages/witnessPersInfo';
import witnessContInfo from '../pages/witnessContInfo';
import claimantPersInfo from '../pages/claimantPersInfo';
import claimantIdInfo from '../pages/claimantIdInfo';
import claimantAddrInfo from '../pages/claimantAddrInfo';
import claimantContInfo from '../pages/claimantContInfo';
import vetPersInfo from '../pages/vetPersInfo';
import vetIdInfo from '../pages/vetIdInfo';
import vetAddrInfo from '../pages/vetAddrInfo';
import vetContInfo from '../pages/vetContInfo';
import statement from '../pages/statement';

// "Flows" in comments below map to "Stories" in the mockups:
// https://www.sketch.com/s/a11421d3-c148-41a2-a34f-3d7821ea676f

// mock-data import for local development
// import the appropriate file [...-flow?.json] for the flow you're working on, or
// test-data-no-stmtinfo.json for all flows [select claimOwnership & claimantType via UI]
import testData from '../tests/fixtures/data/test-data-no-stmtinfo.json';

const mockData = testData.data;
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
  defaultDefinitions: {
    privacyAgreementAccepted: {
      type: 'boolean',
      enum: [true],
    },
  },
  chapters: {
    statementInfoChapter: {
      // for ALL Flows
      // claimOwnership & claimantType decide which Flow to render downstream
      title: 'Who is submitting this statement?',
      hideFormNavProgress: true,
      pages: {
        claimOwnershipPage: {
          path: 'claim-ownership',
          title: 'Who is submitting this statement?',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData:
            !!mockData && environment.isLocalhost() ? mockData : undefined,
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
      // for Flows 2 & 4: 3rd-party claim
      title: 'Your personal information',
      pages: {
        witnessPersonalInfoPage: {
          path: 'witness-personal-information',
          title: 'Your personal information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
          },
          uiSchema: witnessPersInfo.uiSchema,
          schema: witnessPersInfo.schema,
        },
      },
    },
    witnessContactInfoChapter: {
      // for Flows 2 & 4: 3rd-party claim
      title: 'Your contact information',
      pages: {
        witnessContactInfoPage: {
          path: 'witness-contact-information',
          title: 'Your contact information',
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
          },
          uiSchema: witnessContInfo.uiSchema,
          schema: witnessContInfo.schema,
        },
      },
    },
    statementChapterA: {
      // for Flows 2 & 4: 3rd-party claim
      // populates SAME statement field as the other statementChapters
      title: 'Your statement',
      pages: {
        statementPage: {
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
          },
          path: 'statement',
          title: 'Please indicate the claimed issue that you are addressing',
          uiSchema: statement.uiSchema,
          schema: statement.schema,
        },
      },
    },
    claimantPersonalInfoChapter: {
      // for Flows 3 & 4: non-vet claimant
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF
          ? 'Your personal information'
          : 'Claimant’s personal information',
      pages: {
        claimantPersInfoPage: {
          path: 'claimant-personal-information',
          title: 'Your personal information',
          depends: {
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          uiSchema: claimantPersInfo.uiSchema,
          schema: claimantPersInfo.schema,
        },
      },
    },
    claimantIdInfoChapter: {
      // for Flows 3 & 4: non-vet claimant
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF
          ? 'Your identification information'
          : 'Claimant’s identification information',
      pages: {
        claimantIdInfoPage: {
          path: 'claimant-identification-information',
          title: 'Claimant’s identification information',
          depends: {
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          uiSchema: claimantIdInfo.uiSchema,
          schema: claimantIdInfo.schema,
        },
      },
    },
    claimantAddrInfoChapter: {
      // for Flows 3 & 4: non-vet claimant
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF
          ? 'Your mailing address'
          : 'Claimant’s mailing address',
      pages: {
        claimantAddrInfoPage: {
          path: 'claimant-address-information',
          title: 'Claimant’s mailing address',
          depends: {
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          uiSchema: claimantAddrInfo.uiSchema,
          schema: claimantAddrInfo.schema,
        },
      },
    },
    claimantContactInfoChapter: {
      // for Flows 3 & 4: non-vet claimant
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF
          ? 'Your contact information'
          : 'Claimant’s contact information',
      pages: {
        claimantContInfoPage: {
          path: 'claimant-contact-information',
          title: 'Claimant’s contact information',
          depends: {
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          uiSchema: claimantContInfo.uiSchema,
          schema: claimantContInfo.schema,
        },
      },
    },
    statementChapterB: {
      // for Flow 3: self claim, non-veteran claimant
      // populates SAME statement field as the other statementChapters
      title: 'Your statement',
      pages: {
        statementPage: {
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.SELF,
            claimantType: CLAIMANT_TYPES.NON_VETERAN,
          },
          path: 'statement',
          title: 'Please indicate the claimed issue that you are addressing',
          uiSchema: statement.uiSchema,
          schema: statement.schema,
        },
      },
    },
    veteranPersonalInfo: {
      // for All flows
      title: ({ formData } = {}) =>
        formData.claimOwnership === CLAIM_OWNERSHIPS.SELF &&
        formData.claimantType === CLAIMANT_TYPES.VETERAN
          ? 'Your personal information'
          : 'Veteran’s personal information',
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
          : 'Veteran’s identification information',
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
          : 'Veteran’s mailing address',
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
          : 'Veteran’s contact information',
      pages: {
        veteranContactInfo1: {
          path: 'veteran-contact-information',
          title: 'Veteran contact information',
          uiSchema: vetContInfo.uiSchema,
          schema: vetContInfo.schema,
        },
      },
    },
    statementChapterC: {
      // for Flow 1: self claim, veteran claimant
      // populates SAME statement field as the other statementChapters
      title: 'Your statement',
      pages: {
        statementPage: {
          depends: {
            claimOwnership: CLAIM_OWNERSHIPS.SELF,
            claimantType: CLAIMANT_TYPES.VETERAN,
          },
          path: 'statement',
          title: 'Please indicate the claimed issue that you are addressing',
          uiSchema: statement.uiSchema,
          schema: statement.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
