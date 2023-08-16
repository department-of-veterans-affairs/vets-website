import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import CustomHeader from '../components/CustomHeader';
import authorizerType from '../pages/authorizerType';
import nameAndDate from '../pages/nameAndDate';
import identificationInformation from '../pages/identificationInformation';
import address from '../pages/mailingAddress';
import phoneAndEmail from '../pages/phoneAndEmail';
import thirdPartyType from '../pages/thirdPartyType';
import organizationInfo from '../pages/organizationInfo';

/**
 * This form is used for experimentally testing a custom header.
 * Check 21-0845 for the actual form
 */

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-alternate-header-0845',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  CustomHeader,
  preSubmitInfo: {},
  formId: 'FORM_MOCK_ALT_HEADER',
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
  chapters: {
    userIdentificationChapter: {
      title: 'User identification',
      pages: {
        authTypePage: {
          path: 'authorizer-type',
          title: 'Who’s submitting this authorization?',
          uiSchema: authorizerType.uiSchema,
          schema: authorizerType.schema,
        },
      },
    },
    yourInformationChapter: {
      title: 'Your information',
      pages: {
        nameAndDatePage: {
          path: 'name-and-date-of-birth',
          title: 'Your name and dated of birth',
          uiSchema: nameAndDate.uiSchema,
          schema: nameAndDate.schema,
        },
        identificationInfoPage: {
          path: 'identification-information',
          title: 'Your identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
        mailingAddressPage: {
          path: 'mailing-address',
          title: 'Your mailing address',
          uiSchema: address.uiSchema,
          schema: address.schema,
        },
        phoneAndEmailPage: {
          path: 'phone-and-email',
          title: 'Your phone and email',
          uiSchema: phoneAndEmail.uiSchema,
          schema: phoneAndEmail.schema,
        },
      },
    },
    disclosureInfoChapter: {
      title: 'Disclosure information',
      pages: {
        thirdPartyTypePage: {
          path: 'third-party-type',
          title:
            'Do you authorize us to release your information to a specific person or to an organization?',
          uiSchema: thirdPartyType.uiSchema,
          schema: thirdPartyType.schema,
        },
        organizationInfoPage: {
          path: 'organization-information',
          title: "Organization's information",
          uiSchema: organizationInfo.uiSchema,
          schema: organizationInfo.schema,
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
