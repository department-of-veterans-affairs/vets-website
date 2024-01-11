import {
  fullNameSchema,
  fullNameUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  addressSchema,
  addressUI,
  phoneSchema,
  phoneUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  dateOfDeathSchema,
  dateOfDeathUI,
  yesNoSchema,
  yesNoUI,
  titleSchema,
  inlineTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from 'platform/utilities/data/get';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import SectionCompleteAlert from '../components/SectionCompleteAlert.jsx';
import ConfirmationPage from '../containers/ConfirmationPage';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-10D-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-10D',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your CHAMPVA benefits application (10-10D) is in progress.',
    //   expired: 'Your saved CHAMPVA benefits application (10-10D) has expired. If you want to apply for CHAMPVA benefits, please start a new application.',
    //   saved: 'Your CHAMPVA benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for CHAMPVA benefits.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA benefits.',
  },
  title: '10-10d Application for CHAMPVA benefits',
  defaultDefinitions: {},
  chapters: {
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        page1: {
          path: 'sponsor-information/name-dob',
          title: 'Sponsor name and date of birth',
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor name and date of birth'),
            veteransFullName: fullNameUI(),
            sponsorDOB: dateOfBirthUI(),
          },
          schema: {
            type: 'object',
            required: ['sponsorDOB'],
            properties: {
              sponsorInfoTitle: titleSchema,
              veteransFullName: fullNameSchema,
              sponsorDOB: dateOfBirthSchema,
            },
          },
        },
        page2: {
          path: 'sponsor-information/ssn',
          title: 'Sponsor SSN and VA file number',
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor SSN or VA file number'),
            ssn: ssnOrVaFileNumberUI(),
          },
          schema: {
            type: 'object',
            required: ['ssn'],
            properties: {
              sponsorInfoTitle: titleSchema,
              ssn: ssnOrVaFileNumberSchema,
            },
          },
        },
        page3: {
          path: 'sponsor-information/status',
          title: 'Sponsor status',
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor status'),
            sponsorIsDeceased: yesNoUI({
              title: 'Is sponsor still living?',
              labels: {
                Y: 'Yes, sponsor is alive',
                N: 'No, sponsor is deceased',
              },
              yesNoReverse: true,
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorIsDeceased'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorIsDeceased: yesNoSchema,
            },
          },
        },
        page4: {
          path: 'sponsor-information/status-date',
          title: 'Sponsor status',
          depends: formData => get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor status'),
            sponsorDOD: dateOfDeathUI(),
            sponsorDeathConditions: yesNoUI({
              title: 'Did sponsor pass away on active military service?',
              labels: {
                Y: 'Yes, sponsor passed away during active military service',
                N:
                  'No, sponsor did not pass away during active military service',
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorDOD'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorDOD: dateOfDeathSchema,
              sponsorDeathConditions: yesNoSchema,
            },
          },
        },
        page6: {
          path: 'sponsor-information/address',
          title: "Sponsor's address",
          depends: formData => !get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI("Sponsor's address"),
            sponsorAddress: {
              ...addressUI({
                labels: {
                  militaryCheckbox:
                    'My sponsor lives on a United States military base outside the country.',
                },
              }),
            },
          },
          schema: {
            type: 'object',
            required: ['sponsorAddress'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorAddress: addressSchema(),
            },
          },
        },
        page7: {
          path: 'sponsor-information/phone',
          title: "Sponsor's phone number",
          depends: formData => !get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI("Sponsor's phone number"),
            sponsorPhone: {
              ...phoneUI({
                title: 'Home phone number',
              }),
              'ui:required': () => true,
            },
            sponsorPhoneAlt: {
              ...phoneUI({ title: 'Mobile phone number' }),
            },
          },
          schema: {
            type: 'object',
            required: ['sponsorPhone'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorPhone: phoneSchema,
              sponsorPhoneAlt: phoneSchema,
            },
          },
        },
        page7a: {
          path: 'sponsor-information/complete',
          title: 'Sponsor information complete',
          uiSchema: {
            'view:alert': {
              'ui:title': SectionCompleteAlert,
            },
            'ui:options': {
              keepInPageOnReview: false,
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:alert': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
