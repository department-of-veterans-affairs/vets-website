import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import getHelp from '../../shared/components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { TITLE, SUBTITLE, PREPARER_TYPES } from './constants';
import {
  getPersonalInformationChapterTitle,
  getContactInfoChapterTitle,
} from '../helpers';
import {
  nonVeteranDateOfBirthPage,
  veteranNameAndDateofBirthPageA,
} from '../pages/nameAndDateOfBirth';
import {
  nonVeteranIdInfoPage,
  veteranIdInfoPage,
} from '../pages/identificationInfo';
import {
  nonVeteranMailingAddressPage,
  veteranMailingAddressPage,
} from '../pages/mailingAddress';
import {
  nonVeteranPhoneAndEmailPage,
  veteranPhoneAndEmailPage,
} from '../pages/phoneAndEmail';
import {
  nonVeteranStatementPage,
  veteranStatementPage,
} from '../pages/statement';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  dev: {
    collapsibleNavLinks: true,
    showNavLinks: !window.Cypress,
  },
  trackingPrefix: 'ss-4138-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-4138',
  saveInProgress: {
    messages: {
      inProgress:
        'Your statement in support of a claim application (21-4138) is in progress.',
      expired:
        'Your saved statement in support of a claim application (21-4138) has expired. If you want to apply for statement in support of a claim, please start a new application.',
      saved: 'Your statement in support of a claim application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  hideUnauthedStartLink: true,
  signInHelpList: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for statement in support of a claim.',
    noAuth:
      'Please sign in again to continue your application for statement in support of a claim.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    statementTypeChapter: {
      title: 'What kind of statement do you want to submit?',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: { name: { 'ui:title': 'Burt' } },
          schema: {
            type: 'object',
            properties: { name: { type: 'string' } },
          },
        },
      },
    },
    personalInformationChapter: {
      title: ({ formData }) => getPersonalInformationChapterTitle(formData),
      pages: {
        nonVeteranNameAndDateOfBirthPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'non-veteran-name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nonVeteranDateOfBirthPage.uiSchema,
          schema: nonVeteranDateOfBirthPage.schema,
          pageClass: 'non-veteran-name-and-date-of-birth',
        },
        veteranNameAndDateOfBirthPageA: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'veteran-name-and-date-of-birth-a',
          title: 'Name and date of birth',
          uiSchema: veteranNameAndDateofBirthPageA.uiSchema,
          schema: veteranNameAndDateofBirthPageA.schema,
          pageClass: 'veteran-name-and-date-of-birth',
        },
      },
    },
    identificationChapter: {
      title: ({ formData }) => getPersonalInformationChapterTitle(formData),
      pages: {
        veteranIdentificationInformationPageA: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'veteran-identification-information-a',
          title: 'Identification information',
          uiSchema: veteranIdInfoPage.uiSchema,
          schema: veteranIdInfoPage.schema,
          pageClass: 'veteran-identification-information',
        },
        nonVeteranIdentificationInformationPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'non-veteran-identification-information',
          title: 'Identification information',
          uiSchema: nonVeteranIdInfoPage.uiSchema,
          schema: nonVeteranIdInfoPage.schema,
          pageClass: 'non-veteran-identification-information',
        },
      },
    },
    mailingAddressChapter: {
      title: ({ formData }) => getContactInfoChapterTitle(formData),
      pages: {
        veteranMailingAddressPage: {
          depends: formData => formData.preparerType === PREPARER_TYPES.VETERAN,
          path: 'veteran-mailing-address',
          title: 'Mailing address',
          uiSchema: veteranMailingAddressPage.uiSchema,
          schema: veteranMailingAddressPage.schema,
          pageClass: 'veteran-mailing-address',
        },
        nonVeteranMailingAddressPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN,
          path: 'non-veteran-mailing-address',
          title: 'Mailing address',
          uiSchema: nonVeteranMailingAddressPage.uiSchema,
          schema: nonVeteranMailingAddressPage.schema,
          pageClass: 'non-veteran-mailing-address',
        },
      },
    },
    contactInformationChapter: {
      title: ({ formData }) => getContactInfoChapterTitle(formData),
      pages: {
        veteranPhoneAndEmailPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'veteran-phone-and-email',
          title: 'Phone and email address',
          uiSchema: veteranPhoneAndEmailPage.uiSchema,
          schema: veteranPhoneAndEmailPage.schema,
          pageClass: 'veteran-phone-and-email',
        },
        nonVeteranPhoneAndEmailPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'non-veteran-phone-and-email',
          title: 'Phone and email address',
          uiSchema: nonVeteranPhoneAndEmailPage.uiSchema,
          schema: nonVeteranPhoneAndEmailPage.schema,
          pageClass: 'non-veteran-phone-and-email',
        },
      },
    },
    statementChapter: {
      title: 'Provide your statement',
      pages: {
        veteranStatement: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'veteran-statement',
          title: 'Your statement',
          uiSchema: veteranStatementPage.uiSchema,
          schema: veteranStatementPage.schema,
          pageClass: 'veteran-statement',
        },
        nonVeteranStatement: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'non-veteran-statement',
          title: 'Your statement',
          uiSchema: nonVeteranStatementPage.uiSchema,
          schema: nonVeteranStatementPage.schema,
          pageClass: 'non-veteran-statement',
        },
      },
    },
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      // fullNamePath: formData => statementOfTruthFullNamePath({ formData }),
      checkboxLabel:
        'I confirm that the information above is correct and true to the best of my knowledge and belief.',
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
