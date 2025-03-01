import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// TODO: We want to source these from current, common definitions
import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // TODO: Figure out actual API and structure, create submit function, create any transformers, vets-json schema
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'new-careers-employment-28-1900-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_28_1900,
  // TODO: Set up save in progress/prefill
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your VR&amp;E Chapter 31 benefits application application (28-1900) is in progress.',
    //   expired: 'Your saved VR&amp;E Chapter 31 benefits application application (28-1900) has expired. If you want to apply for VR&amp;E Chapter 31 benefits application, please start a new application.',
    //   saved: 'Your VR&amp;E Chapter 31 benefits application application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for VR&amp;E Chapter 31 benefits application.',
    noAuth:
      'Please sign in again to continue your application for VR&amp;E Chapter 31 benefits application.',
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

    // TODO: Common definitions needed
    // veteranInformationChapter: {
    //   title: 'Your Information',
    //   pages: {
    //     personalInformation: {
    //       path: 'personal-information',
    //       title: 'Personal Information',
    //       schema: {
    //         type: 'object',
    //         required: ['firstName', 'lastName', 'dateOfBirth'],
    //         properties: {
    //           firstName: { type: 'string' },
    //           middleName: { type: 'string' },
    //           lastName: { type: 'string' },
    //           suffix: {
    //             type: 'string',
    //             enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', ''],
    //           },
    //           dateOfBirth: { type: 'string', format: 'date' },
    //         },
    //       },
    // uiSchema: {
    //         firstName: {
    //           'ui:title': 'First name',
    //           'ui:required': () => true,
    //           'ui:errorMessages': {
    //             required: 'Please enter your first name.',
    //           },
    //         },
    //         middleName: {
    //           'ui:title': 'Middle name',
    //         },
    //         lastName: {
    //           'ui:title': 'Last name',
    //           'ui:required': () => true,
    //           'ui:errorMessages': {
    //             required: 'Please enter your last name.',
    //           },
    //         },
    //         suffix: {
    //           'ui:title': 'Suffix',
    //           'ui:options': {
    //             labels: {
    //               'Jr.': 'Jr.',
    //               'Sr.': 'Sr.',
    //               'II': 'II',
    //               'III': 'III',
    //               'IV': 'IV',
    //             },
    //           },
    //         },
    //         dateOfBirth: {
    //           'ui:title': 'Date of birth',
    //           'ui:widget': 'date',
    //           'ui:required': () => true,
    //           'ui:errorMessages': {
    //             required: 'Please provide your date of birth.',
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
