// this form does NOT use JSON schema for its data model
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import manifest from '../manifest.json';
import transformForSubmit from './submit-transformer';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { pageFocusScroll, pageFocusScrollNoProgressBar } from './helpers';
import getHelp from '../../shared/components/GetFormHelp';
import { AUTHORIZER_TYPES, INFORMATION_SCOPES } from '../definitions/constants';
// pages
import authorizerTypePg from '../pages/authorizerType';
import veteranPersonalInfoPg from '../pages/veteranPersonalInfo';
import veteranIdInfoPg from '../pages/veteranIdInfo';
import veteranContactInfoPg from '../pages/veteranContactInfo';
import thirdPartyTypePg from '../pages/thirdPartyType';
import personNamePg from '../pages/personName';
import personAddressPg from '../pages/personAddress';
import organizationNamePg from '../pages/organizationName';
import organizationRepsPg from '../pages/organizationReps';
import organizationAddressPg from '../pages/organizationAddress';
import infoScopePg from '../pages/infoScope';
import limitedInfoPg from '../pages/limitedInfo';
import releaseDurationPg from '../pages/releaseDuration';
import releaseEndDatePg from '../pages/releaseEndDate';
import securityQuestionPg from '../pages/securityQuestion';
import securityAnswerPg from '../pages/securityAnswer';
import authorizerPersonalInfoPg from '../pages/authorizerPersonalInfo';
import authorizerAddressPg from '../pages/authorizerAddress';
import authorizerContactInfoPg from '../pages/authorizerContactInfo';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/noAuthType.json';

const mockData = testData.data;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  // submit: () => Promise.resolve({ confirmationNumber: '123123123' }),
  transformForSubmit,
  trackingPrefix: 'auth-disclose-0845',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: formData =>
        formData.authorizerType === AUTHORIZER_TYPES.VETERAN
          ? 'veteranFullName'
          : 'authorizerFullName',
    },
  },
  formId: '21-0845',
  dev: {
    showNavLinks: !window.Cypress,
    collapsibleNavLinks: true,
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your release authorization (21-0845) is in progress.',
      expired:
        'Your saved release authorization (21-0845) has expired. If you want to apply for release authorization, please start a new application.',
      saved: 'Your release authorization has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for release authorization.',
    noAuth: 'Please sign in again to continue your release authorization.',
  },
  title: 'Authorize VA to release your information to a third party source',
  subTitle:
    'Authorization To Disclose Personal Information To a Third Party (VA Form 21-0845)',
  defaultDefinitions: {
    privacyAgreementAccepted: {
      type: 'boolean',
      enum: [true],
    },
  },
  useCustomScrollAndFocus: true,
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
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          uiSchema: authorizerTypePg.uiSchema,
          schema: authorizerTypePg.schema,
          // needs form-level useCustomScrollAndFocus: true to work.
          scrollAndFocusTarget: pageFocusScrollNoProgressBar(),
          pageClass: 'authorizer-type',
        },
      },
    },
    authorizerPersonalInfoChapter: {
      title: 'Your personal information',
      pages: {
        authPersInfoPage: {
          // nonVet authorizer
          path: 'authorizer-personal-information',
          title: 'Your personal information',
          depends: {
            authorizerType: AUTHORIZER_TYPES.NON_VETERAN,
          },
          uiSchema: authorizerPersonalInfoPg.uiSchema,
          schema: authorizerPersonalInfoPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'authorizer-personal-information',
        },
      },
    },
    authorizerAddressChapter: {
      title: 'Your address',
      pages: {
        authAddrPage: {
          path: 'authorizer-address',
          title: 'Your address',
          depends: {
            authorizerType: AUTHORIZER_TYPES.NON_VETERAN,
          },
          uiSchema: authorizerAddressPg.uiSchema,
          schema: authorizerAddressPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'authorizer-address',
        },
      },
    },
    authorizerContactInfoChapter: {
      title: 'Your contact information',
      pages: {
        authContactInfoPage: {
          path: 'authorizer-contact-information',
          title: 'Your contact information',
          depends: {
            authorizerType: AUTHORIZER_TYPES.NON_VETERAN,
          },
          uiSchema: authorizerContactInfoPg.uiSchema,
          schema: authorizerContactInfoPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'authorizer-contact-information',
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
          title: '',
          uiSchema: veteranPersonalInfoPg.uiSchema,
          schema: veteranPersonalInfoPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'veteran-personal-information',
        },
      },
    },
    veteranContactInfoChapter: {
      title: 'Your contact information',
      pages: {
        vetContactInfoPage: {
          path: 'veteran-contact-information',
          title: 'Your contact information',
          depends: {
            authorizerType: AUTHORIZER_TYPES.VETERAN,
          },
          uiSchema: veteranContactInfoPg.uiSchema,
          schema: veteranContactInfoPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
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
          title: '',
          uiSchema: veteranIdInfoPg.uiSchema,
          schema: veteranIdInfoPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'veteran-identification-information',
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
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-third-party-type',
        },
        personNamePage: {
          // person third-party
          path: 'disclosure-information-person-name',
          title: 'Person’s name',
          depends: {
            thirdPartyType: 'person',
          },
          uiSchema: personNamePg.uiSchema,
          schema: personNamePg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-person-name',
        },
        personAddressPage: {
          // person third-party
          path: 'disclosure-information-person-address',
          title: 'Person’s address',
          depends: {
            thirdPartyType: 'person',
          },
          uiSchema: personAddressPg.uiSchema,
          schema: personAddressPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-person-address',
        },
        organizationNamePage: {
          // organization third-party
          path: 'disclosure-information-organization-name',
          title: 'Organization’s name',
          depends: {
            thirdPartyType: 'organization',
          },
          uiSchema: organizationNamePg.uiSchema,
          schema: organizationNamePg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-organization-name',
        },
        organizationRepresentativesPage: {
          // organization third-party
          path: 'disclosure-information-organization-representatives',
          title: 'Organization’s representatives',
          depends: {
            thirdPartyType: 'organization',
          },
          uiSchema: organizationRepsPg.uiSchema,
          schema: organizationRepsPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-organization-representatives',
        },
        organizationAddressPage: {
          // organization third-party
          path: 'disclosure-information-organization-address',
          title: 'Organization’s address',
          depends: {
            thirdPartyType: 'organization',
          },
          uiSchema: organizationAddressPg.uiSchema,
          schema: organizationAddressPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-organization-address',
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
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-scope',
        },
        limitedInformationPage: {
          // limited info-scope
          path: 'disclosure-information-limited-information',
          title: 'Limited information',
          depends: {
            informationScope: INFORMATION_SCOPES.LIMITED,
          },
          uiSchema: limitedInfoPg.uiSchema,
          schema: limitedInfoPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-limited-information',
        },
        releaseDurationPage: {
          path: 'disclosure-information-release-duration',
          title: 'Release duration',
          depends: {
            informationScope: INFORMATION_SCOPES.ANY,
          },
          uiSchema: releaseDurationPg.uiSchema,
          schema: releaseDurationPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-release-duration',
        },
        releaseEndDatePage: {
          // untilDate release-duration
          path: 'disclosure-information-release-end-date',
          title: 'Release end date',
          depends: {
            informationScope: INFORMATION_SCOPES.ANY,
            releaseDuration: 'untilDate',
          },
          uiSchema: releaseEndDatePg.uiSchema,
          schema: releaseEndDatePg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'disclosure-information-release-end-date',
        },
      },
    },
    securityInfoChapter: {
      title: ({ formData }) =>
        formData.authorizerType === AUTHORIZER_TYPES.VETERAN
          ? 'Security information'
          : 'Security question',
      pages: {
        secQuestionPage: {
          path: 'security-information-question',
          title: 'Security question',
          uiSchema: securityQuestionPg.uiSchema,
          schema: securityQuestionPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'security-information-question',
        },
        secAnswerPage: {
          path: 'security-information-answer',
          title: 'Security answer',
          uiSchema: securityAnswerPg.uiSchema,
          schema: securityAnswerPg.schema,
          scrollAndFocusTarget: pageFocusScroll(),
          pageClass: 'security-information-answer',
        },
      },
    },
  },
  downtime: {
    dependencies: [externalServices.lighthouseBenefitsIntake],
  },
  footerContent,
  getHelp,
  customText: {
    appType: 'authorization',
    reviewPageTitle: 'Review Information',
    appSavedSuccessfullyMessage: 'Your authorization has been saved.',
    startNewAppButtonText: 'Start a new authorization',
    continueAppButtonText: 'Continue your authorization',
    finishAppLaterMessage: 'Finish this authorization later.',
  },
};

export default formConfig;
