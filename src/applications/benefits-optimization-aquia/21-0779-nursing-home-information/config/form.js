import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import { IntroductionPage } from '../containers/introduction-page';
import { ConfirmationPage } from '../containers/confirmation-page';

import { nameAndDateOfBirth } from '../pages/name-and-date-of-birth';
import { identificationInformation } from '../pages/identification-information';
import { mailingAddress } from '../pages/mailing-address';
import { phoneAndEmailAddress } from '../pages/phone-and-email-address';
import { nursingHomeDetails } from '../pages/nursing-home-details';
import { nursingCareInformation } from '../pages/nursing-care-information';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/form21_0779',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-0779-nursing-home-information-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21_0779,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (21-0779) is in progress.',
    //   expired: 'Your saved benefits application (21-0779) has expired. If you want to apply for benefits, please start a new application.',
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
    nursingHomeChapter: {
      title: 'Nursing home information',
      pages: {
        nursingHomeDetails: {
          path: 'nursing-home-details',
          title: 'Nursing home details',
          uiSchema: nursingHomeDetails.uiSchema,
          schema: nursingHomeDetails.schema,
        },
        nursingCareInformation: {
          path: 'nursing-care-information',
          title: 'Care and payment information',
          uiSchema: nursingCareInformation.uiSchema,
          schema: nursingCareInformation.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
