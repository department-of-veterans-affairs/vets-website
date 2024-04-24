import {
  titleUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  phoneSchema,
  phoneUI,
  emailSchema,
  emailUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import environment from 'platform/utilities/environment';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import DowntimeWarning from '../components/FormAlerts/DowntimeWarning';

import { transform } from '../config/submitTransformer';

import militaryHistorySchema from '../pages/militaryHistory';

/** @type {PageSchema} */
export const nameAndDateOfBirthSchema = {
  uiSchema: {
    ...titleUI('Name and date of birth'),
    'view:fullName': fullNameNoSuffixUI(),
    birthDate: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:fullName': fullNameNoSuffixSchema,
      birthDate: dateOfBirthSchema,
    },
  },
};

/** @type {PageSchema} */
export const homeAddressSchema = {
  uiSchema: {
    ...titleUI('Home address'),
    homeAddress: addressNoMilitaryUI(),
  },
  schema: {
    type: 'object',
    properties: {
      homeAddress: addressNoMilitarySchema(),
    },
  },
};

/** @type {PageSchema} */
export const workAddressSchema = {
  uiSchema: {
    ...titleUI('Work address'),
    workAddress: addressNoMilitaryUI(),
  },
  schema: {
    type: 'object',
    properties: {
      workAddress: addressNoMilitarySchema(),
    },
  },
};

/** @type {PageSchema} */
export const placeOfBirthSchema = {
  uiSchema: {
    ...titleUI('Place of birth'),
    placeOfBirth: addressNoMilitaryUI({
      omit: ['street', 'street2', 'street3', 'postalCode'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      placeOfBirth: addressNoMilitarySchema({
        omit: ['street', 'street2', 'street3', 'postalCode'],
      }),
    },
  },
};

/** @type {PageSchema} */
export const contactInfoSchema = {
  uiSchema: {
    agentAttorneyPhone: phoneUI(),
    agentAttorneyEmail: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      agentAttorneyPhone: phoneSchema,
      agentAttorneyEmail: emailSchema,
    },
  },
};

/** @type {PageSchema} */
export const veteranStatusSchema = {
  uiSchema: {
    ...titleUI('Veteran status'),
    'view:veteranStatus': yesNoUI('Are you a veteran?'),
  },
  schema: {
    type: 'object',
    properties: {
      'view:veteranStatus': yesNoSchema,
    },
  },
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${
    environment.API_URL
  }/accredited_representative_portal/accreditation/applications/form21a`,
  trackingPrefix: 'form21a-',
  preSubmitInfo: {
    required: true,
  },
  downtime: {
    dependencies: [externalServices.bgs],
    message: DowntimeWarning,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'VA21A',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your accreditation as a claims agent or attorney application (VA21A) is in progress.',
    //   expired: 'Your saved accreditation as a claims agent or attorney application (VA21A) has expired. If you want to apply for accreditation as a claims agent or attorney, please start a new application.',
    //   saved: 'Your accreditation as a claims agent or attorney application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for accreditation as a claims agent or attorney.',
    noAuth:
      'Please sign in again to continue your application for accreditation as a claims agent or attorney.',
  },
  title: 'Form VA21a',
  defaultDefinitions: {},
  chapters: {
    personalDetails: {
      title: 'Details',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          ...nameAndDateOfBirthSchema,
        },
        homeAddress: {
          path: 'home-address',
          title: 'Home address',
          ...homeAddressSchema,
        },
        workAddress: {
          path: 'work-address',
          title: 'Work address',
          ...workAddressSchema,
        },
        placeOfBirth: {
          path: 'place-of-birth',
          title: 'Place of birth',
          ...placeOfBirthSchema,
        },
        contactInfo: {
          path: 'contact-info',
          title: 'Contact information',
          ...contactInfoSchema,
        },
        veteranStatus: {
          path: 'vet-status',
          title: 'Veteran status',
          ...veteranStatusSchema,
        },
        militaryHistory: {
          path: 'military-service-history',
          title: 'Military service history',
          depends: form => form['view:veteranStatus'],
          ...militaryHistorySchema,
        },
      },
    },
    //chapter2: {
    //  title: 'Chapter 2',
    //  pages: {
    //    page2: {
    //      path: 'second-page',
    //      title: 'Second Page',
    //      uiSchema: {
    //        firstName: {
    //          'ui:title': 'First Name',
    //        },
    //        lastName: {
    //          'ui:title': 'Last Name',
    //        },
    //      },
    //      schema: {
    //        type: 'object',
    //        required: ['firstName'],
    //        properties: {
    //          firstName,
    //          lastName,
    //        },
    //      },
    //    },
    //    page3: {
    //      path: 'third-page',
    //      title: 'Third Page',
    //      uiSchema: {
    //        middleName: {
    //          'ui:title': 'Middle Name',
    //        },
    //      },
    //      schema: {
    //        type: 'object',
    //        required: ['middleName'],
    //        properties: {
    //          middleName,
    //        },
    //      },
    //    },
    //  },
    //},
  },
  transformForSubmit: transform,
};

export default formConfig;
