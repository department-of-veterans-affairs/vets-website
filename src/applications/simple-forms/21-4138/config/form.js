import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import getHelp from '../../shared/components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { TITLE, SUBTITLE, STATEMENT_TYPES } from './constants';
import { statementTypePage } from '../pages/statementType';
import { layOrWitnessHandoffPage } from '../pages/layOrWitnessHandoff';
import { noticeOfDisagreementHandoffPage } from '../pages/noticeOfDisagreementHandoff';
import { nameAndDateOfBirthPage } from '../pages/nameAndDateOfBirth';
import { identificationInformationPage } from '../pages/identificationInfo';
import { mailingAddressPage } from '../pages/mailingAddress';
import { phoneAndEmailPage } from '../pages/phoneAndEmail';
import { statementPage } from '../pages/statement';
import { getMockData } from '../helpers';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/user.json';

const mockData = testData.data;

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
      hideFormNavProgress: true,
      hideFormTitle: true,
      pages: {
        statementTypePage: {
          path: 'statement-type',
          title: 'Statement type',
          uiSchema: statementTypePage.uiSchema,
          schema: statementTypePage.schema,
          pageClass: 'statement-type',
          // we want required fields prefilled for LOCAL testing/previewing one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
        layOrWitnessHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.BUDDY_STATEMENT,
          path: 'lay-or-witness-handoff',
          title: "There's a better way to submit your statement to us",
          uiSchema: layOrWitnessHandoffPage.uiSchema,
          schema: layOrWitnessHandoffPage.schema,
          pageClass: 'lay-or-witness-handoff',
        },
        noticeOfDisagreementHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW,
          path: 'notice-of-disagreement-handoff',
          title: 'What to know before you request a decision review',
          uiSchema: noticeOfDisagreementHandoffPage.uiSchema,
          schema: noticeOfDisagreementHandoffPage.schema,
          pageClass: 'notice-of-disagreement-handoff',
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      hideFormTitle: true,
      pages: {
        nameAndDateOfBirthPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirthPage.uiSchema,
          schema: nameAndDateOfBirthPage.schema,
          pageClass: 'name-and-date-of-birth',
        },
      },
    },
    identificationChapter: {
      title: 'Your identification information',
      hideFormTitle: true,
      pages: {
        identificationInformationPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformationPage.uiSchema,
          schema: identificationInformationPage.schema,
          pageClass: 'identification-information',
        },
      },
    },
    mailingAddressChapter: {
      title: 'Your mailing address',
      hideFormTitle: true,
      pages: {
        mailingAddressPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddressPage.uiSchema,
          schema: mailingAddressPage.schema,
          pageClass: 'mailing-address',
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      hideFormTitle: true,
      pages: {
        phoneAndEmailPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
          path: 'phone-and-email',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailPage.uiSchema,
          schema: phoneAndEmailPage.schema,
          pageClass: 'phone-and-email',
        },
      },
    },
    statementChapter: {
      title: 'Your statement',
      hideFormTitle: true,
      pages: {
        statement: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
          path: 'statement',
          title: 'Your statement',
          uiSchema: statementPage.uiSchema,
          schema: statementPage.schema,
          pageClass: 'statement',
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
