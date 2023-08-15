import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import CustomHeader from '../components/CustomHeader';

const placeholderSchema = {
  type: 'object',
  properties: {},
};

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
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
    },
  },
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
          uiSchema: {},
          schema: placeholderSchema,
        },
      },
    },
    yourInformationChapter: {
      title: 'Your information',
      pages: {
        nameAndDatePage: {
          path: 'name-and-date-of-birth',
          title: 'Your name and dated of birth',
          uiSchema: {},
          schema: placeholderSchema,
        },
        identificationInfoPage: {
          path: 'identification-information',
          title: 'Your identification information',
          uiSchema: {},
          schema: placeholderSchema,
        },
        mailingAddressPage: {
          path: 'mailing-address',
          title: 'Your mailing address',
          uiSchema: {},
          schema: placeholderSchema,
        },
        phoneAndEmailPage: {
          path: 'phone-and-email',
          title: 'Your phone and email',
          uiSchema: {},
          schema: placeholderSchema,
        },
      },
    },
    disclosureInfoChapter: {
      title: 'Disclosure information',
      pages: {
        authTypePage: {
          path: 'authorized-specific-person-or-org',
          title:
            'Do you authorize us to release your information to a specific person or to an organization?',
          uiSchema: {},
          schema: placeholderSchema,
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
