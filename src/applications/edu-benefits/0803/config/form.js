// @ts-check
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import previouslyApplied from '../pages/previouslyApplied';
import vaBenefitProgram from '../pages/vaBenefitProgram';
import payeeNumber from '../pages/payeeNumber';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmail from '../pages/phoneAndEmail';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '0803-edu-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_22_0803,
  saveInProgress: {
    // messages: {
    //   inProgress:
    //     'Your education benefits application (22-0803) is in progress.',
    //   expired:
    //     'Your saved education benefits application (22-0803) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    benefitsInformationChapter: {
      title: 'Your education benefits information',
      pages: {
        hasPreviouslyApplied: {
          path: 'previously-applied',
          title: 'Previously Applied',
          uiSchema: previouslyApplied.uiSchema,
          schema: previouslyApplied.schema,
        },
        vaBenefitProgram: {
          path: 'va-benefit-program',
          title: 'VA Benefit Program',
          uiSchema: vaBenefitProgram.uiSchema,
          schema: vaBenefitProgram.schema,
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...personalInformationPage({
          personalInfoConfig: {
            name: { show: true, required: false },
            ssn: { show: true, required: false },
            dateOfBirth: { show: true, required: false },
          },
          dataAdapter: {
            ssnPath: 'application.claimant.ssn',
          },
        }),
        payeeNumber: {
          path: 'payee-number',
          title: 'Payee Number',
          uiSchema: payeeNumber.uiSchema,
          schema: payeeNumber.schema,
        },
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing Address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        phoneAndEmail: {
          path: 'phone-and-email',
          title: 'Phone and Email',
          uiSchema: phoneAndEmail.uiSchema,
          schema: phoneAndEmail.schema,
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
