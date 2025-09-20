/**
 * @module config/form
 * @description Main form configuration for VA Form 21-2680 - Examination for Housebound Status
 * or Permanent Need for Regular Aid & Attendance
 */

import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-2680-house-bound-status/constants';
import { IntroductionPage } from '@bio-aquia/21-2680-house-bound-status/containers/introduction-page';
import { ConfirmationPage } from '@bio-aquia/21-2680-house-bound-status/containers/confirmation-page';
import {
  nameAndDateOfBirth,
  identificationInformation,
  mailingAddress,
  phoneAndEmailAddress,
} from '@bio-aquia/21-2680-house-bound-status/pages';
import manifest from '../manifest.json';

/**
 * @typedef {Object} FormConfig
 * @property {string} rootUrl - Base URL for the form
 * @property {string} urlPrefix - URL prefix for form pages
 * @property {string} submitUrl - API endpoint for form submission
 * @property {Function} submit - Form submission handler
 * @property {string} trackingPrefix - Analytics tracking prefix
 * @property {React.Component} introduction - Introduction page component
 * @property {React.Component} confirmation - Confirmation page component
 * @property {Object} dev - Development settings
 * @property {string} formId - Unique form identifier
 * @property {Object} saveInProgress - Save-in-progress configuration
 * @property {number} version - Form version number
 * @property {boolean} prefillEnabled - Enable prefilling from user profile
 * @property {Object} savedFormMessages - Custom messages for saved forms
 * @property {string} title - Form title
 * @property {string} subTitle - Form subtitle
 * @property {Object} defaultDefinitions - Default schema definitions
 * @property {Object} chapters - Form chapters configuration
 * @property {React.Component|string} footerContent - Footer content component
 */

/**
 * Main form configuration object for VA Form 21-2680
 * @type {FormConfig}
 */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-2680-house-bound-status-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21_2680,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (21-2680) is in progress.',
    //   expired: 'Your saved benefits application (21-2680) has expired. If you want to apply for benefits, please start a new application.',
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

export default formConfig;
