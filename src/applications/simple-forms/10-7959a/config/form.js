import {
  phoneUI,
  phoneSchema,
  yesNoUI,
  inlineTitleUI,
  addressSchema,
  addressUI,
  titleSchema,
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-7959a-reimbursement-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-7959A',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your medical expense reimbursement application (10-7959A) is in progress.',
    //   expired: 'Your saved medical expense reimbursement application (10-7959A) has expired. If you want to apply for medical expense reimbursement, please start a new application.',
    //   saved: 'Your medical expense reimbursement application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for medical expense reimbursement.',
    noAuth:
      'Please sign in again to continue your application for medical expense reimbursement.',
  },
  title: 'Form 10-7959a Reimbursement ',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Personal Information',
      pages: {
        page1: {
          path: 'patient-info',
          title: 'SECTION I - PATIENT INFORMATION',
          uiSchema: {
            patientNameTitle: inlineTitleUI('Patient Name'),
            patientName: fullNameUI(),
            memberNumber: {
              'ui:title': 'CHAMPVA Member Number',
            },
            patientAddressTitle: inlineTitleUI("Patient's Address"),
            patientAddress: {
              ...addressUI({
                labels: {
                  newAddress: 'Check if new address',
                },
              }),
            },
            dateOfBirthTitle: inlineTitleUI('Date of Birth (mm/dd/yyyy'),
            dateOfBirth: dateOfBirthUI(),
            patientPhoneNumber: {
              ...phoneUI({
                title: 'Phone Number (include area code)',
              }),
            },
          },
          schema: {
            required: ['firstName', 'lastName', 'memberNumber'],
            type: 'object',
            properties: {
              memberNumber: {
                type: 'number',
              },
              patientNameitle: titleSchema,
              patientName: fullNameSchema,
              patientAddress: addressSchema(),
              dateOfBirth: dateOfBirthSchema,
              patientPhoneNumber: phoneSchema,
            },
          },
        },
        page2: {
          path: 'ohi-info',
          title: 'SECTION II - OTHER HEALTH INSURANCE (OHI) INFORMATION',
          subtitle:
            'If more space is needed, please continue in the same format on a separate sheet.',
          uiSchema: {
            workRelatedTitle: inlineTitleUI('Work Related Injury'),
            workRelatedInjury: yesNoUI({
              title: 'Was treatement for a work-related injury/condition?',
              labels: {
                Y: 'Yes',
                N: 'No',
              },
            }),
            nonWorkRelatedTitle: inlineTitleUI('Non Work Related Injury'),
            nonWorkRelatedInjury: yesNoUI({
              title: 'Was treatment for an injury or accident outside of work?',
              labels: {
                Y: 'Yes',
                N: 'No',
              },
            }),
            patientCoveredByOHITitle: inlineTitleUI('Patient Covered by OHI'),
            patientCoveredByOHI: yesNoUI({
              title:
                'Is patient covereed by OHI to include coverage through a family member? (Supllemental or secondary insurance excluded)',
              labels: {
                Y: 'Yes (check type and provide coverage information below)',
                N: 'No (proceed to Section III)',
              },
            }),
            otherInsuranceName: {
              'ui:title': 'Name of Other Insurance (OHI)',
            },
            policyNumber: {
              'ui:title': 'Policy Number',
            },
            insurancePhoneNumber: {
              ...phoneUI({
                title: 'Phone Number (include area code)',
              }),
            },
          },
          schema: {
            type: 'object',
            properties: {
              workRelatedInjury: yesNoUI,
              nonWorkRelatedInjury: yesNoUI,
              patientCoveredByOHI: yesNoUI,
              insurancePhoneNumber: phoneSchema,
            },
          },
        },
        page3: {
          path: 'ohi-info',
          title: 'SECTION III - SPONSOR INFORMATION',
          uiSchema: {
            sponsorNameTitle: inlineTitleUI('Sponsor Name'),
            sponsorName: fullNameUI(),
          },
          schema: {
            type: 'object',
            properties: {
              sponsorName: fullNameSchema,
            },
          },
          // schema: {
          //   required: ['firstName', 'lastName', 'memberNumber'],
          //   type: 'object',
          //   properties: {
          //     claimantNameitle: titleSchema,
          //     claimantName: fullNameSchema,
          //     claimantAddress: addressSchema(),
          //     claimantDateOfBirth: dateOfBirthSchema,
          //     claimantPhoneNumber: phoneSchema,
          //     memberNumber: {
          //       type: 'number',
          //     },
          //     },
          //     insurancePhoneNumber: {
          //       type: 'object',
          //       properties: {
          //         phoneNumber: phoneSchema,
          //       },
          //     },
          //   },
        },
      },
    },
  },
};

export default formConfig;
