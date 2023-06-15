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
import vetIdInfoPg from '../pages/vetIdInfo';
import thirdPartyTypePg from '../pages/thirdPartyType';
import persNamePg from '../pages/persName';
import persAddrPg from '../pages/persAddr';
import orgNamePg from '../pages/orgName';
import orgRepsPg from '../pages/orgReps';
import orgAddrPg from '../pages/orgAddr';
import infoScopePg from '../pages/infoScope';
import limitedInfoPg from '../pages/limitedInfo';
import relDurationPg from '../pages/relDuration';
import relEndDatePg from '../pages/relEndDate';

// mock-data import for local development
// import the appropriate file [flow?.json] for the flow you're working on, or
// noStmtInfo.json for all flows [select claimOwnership & claimantType via UI]
import testData from '../tests/fixtures/data/testdata.json';

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
  dev: {
    showNavLinks: true,
  },
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
    veteranIdentificationInfoChapter: {
      title: ({ formData }) =>
        formData?.authorizerType === AUTHORIZER_TYPES.VETERAN
          ? 'Your identification information'
          : 'Veteran’s identification information',
      pages: {
        vetIdInfoPage: {
          path: 'veteran-identification-information',
          title: 'Your identification information',
          uiSchema: vetIdInfoPg.uiSchema,
          schema: vetIdInfoPg.schema,
        },
      },
    },
    disclosureInfoChapter: {
      title: 'Disclosure information',
      pages: {
        thirdPartyTypePage: {
          path: 'disclosure-information-third-party-type',
          title: 'Third-party type',
          uiSchema: thirdPartyTypePg.uiSchema,
          schema: thirdPartyTypePg.schema,
        },
        personNamePage: {
          // person third-party
          path: 'disclosure-information-person-name',
          title: 'Person’s name',
          depends: {
            thirdPartyType: 'person',
          },
          uiSchema: persNamePg.uiSchema,
          schema: persNamePg.schema,
        },
        personAddressPage: {
          // person third-party
          path: 'disclosure-information-person-address',
          title: 'Person’s address',
          depends: {
            thirdPartyType: 'person',
          },
          uiSchema: persAddrPg.uiSchema,
          schema: persAddrPg.schema,
        },
        organizationNamePage: {
          // organization third-party
          path: 'disclosure-information-organization-name',
          title: 'Organization’s name',
          depends: {
            thirdPartyType: 'organization',
          },
          uiSchema: orgNamePg.uiSchema,
          schema: orgNamePg.schema,
        },
        organizationRepresentativesPage: {
          // organization third-party
          path: 'disclosure-information-organization-representatives',
          title: 'Organization’s representatives',
          depends: {
            thirdPartyType: 'organization',
          },
          uiSchema: orgRepsPg.uiSchema,
          schema: orgRepsPg.schema,
        },
        organizationAddressPage: {
          // organization third-party
          path: 'disclosure-information-organization-address',
          title: 'Organization’s address',
          depends: {
            thirdPartyType: 'organization',
          },
          uiSchema: orgAddrPg.uiSchema,
          schema: orgAddrPg.schema,
        },
      },
    },
    infoReleaseChapter: {
      title: 'Information to release',
      pages: {
        informationScopePage: {
          path: 'disclosure-information-scope',
          title: 'Information scope',
          uiSchema: infoScopePg.uiSchema,
          schema: infoScopePg.schema,
        },
        limitedInformationPage: {
          // limited info-scope
          path: 'disclosure-information-limited-information',
          title: 'Limited information',
          depends: {
            informationScope: 'limited',
          },
          uiSchema: limitedInfoPg.uiSchema,
          schema: limitedInfoPg.schema,
        },
        releaseDurationPage: {
          path: 'disclosure-information-release-duration',
          title: 'Release duration',
          uiSchema: relDurationPg.uiSchema,
          schema: relDurationPg.schema,
        },
        releaseEndDatePage: {
          // untilDate release-duration
          path: 'disclosure-information-release-end-date',
          title: 'Release end date',
          depends: {
            releaseDuration: 'untilDate',
          },
          uiSchema: relEndDatePg.uiSchema,
          schema: relEndDatePg.schema,
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
