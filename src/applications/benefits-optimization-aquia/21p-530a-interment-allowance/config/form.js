/**
 * @module config/form
 * @description Form configuration for VA Form 21P-530A Application for Interment Allowance
 */

import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21p-530a-interment-allowance/constants';
import manifest from '@bio-aquia/21p-530a-interment-allowance/manifest.json';
import { IntroductionPage } from '@bio-aquia/21p-530a-interment-allowance/containers/introduction-page';
import { ConfirmationPage } from '@bio-aquia/21p-530a-interment-allowance/containers/confirmation-page';

import { nameAndDateOfBirth } from '@bio-aquia/21p-530a-interment-allowance/pages/name-and-date-of-birth';
import { identificationInformation } from '@bio-aquia/21p-530a-interment-allowance/pages/identification-information';
import { mailingAddress } from '@bio-aquia/21p-530a-interment-allowance/pages/mailing-address';
import { phoneAndEmailAddress } from '@bio-aquia/21p-530a-interment-allowance/pages/phone-and-email-address';

/**
 * Main form configuration object
 * @type {FormConfig}
 */
export const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21p-530a-interment-allowance-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21P_530A,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (21P-530A) is in progress.',
    //   expired: 'Your saved benefits application (21P-530A) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
      },
    },
    mailingAddressChapter: {
      title: 'Mailing address',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

// Platform expects default export for form config
export default formConfig;
