// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  inlineTitleUI,
  fullNameUI,
  fullNameSchema,
  phoneUI,
  phoneSchema,
  titleUI,
  titleSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from '../10-7959F-1-schema.json';

// import fullSchema from 'vets-json-schema/dist/10-7959F-1-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-7959f-1-FMP-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
    },
  },
  formId: '10-7959F-1',
  saveInProgress: {
    messages: {
      inProgress: 'Your CHAMPVA application (10-7959F-1) is in progress.',
      expired:
        'Your saved CHAMPVA benefits application (10-7959F-1) has expired. If you want to apply for Foriegn Medical Program benefits, please start a new application.',
      saved: 'Your CHAMPVA benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for CHAMPVA benefits.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA benefits.',
  },
  title: 'Foreign Medical Program (FMP) Registration Form',
  defaultDefinitions: {},
  chapters: {
    applicantInformationChapter: {
      title: "Veteran's Information",
      pages: {
        page1: {
          path: 'veteran-information',
          title: 'Veteran Personal Information',
          uiSchema: {
            ...titleUI(
              "Veteran's personal information",
              'We use this information to contact you and verify other details.',
            ),
            fullName: fullNameUI(),
            veteranDOB: dateOfBirthUI(),
          },
          schema: {
            type: 'object',
            required: ['fullName', 'veteranDOB'],
            properties: {
              titleSchema,
              fullName: fullNameSchema,
              veteranDOB: dateOfBirthSchema,
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
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            address: address.uiSchema('Mailing address'),
            email: {
              'ui:title': 'Primary email',
            },
            altEmail: {
              'ui:title': 'Secondary email',
            },
            phoneNumber: phoneUI(),
          },
          schema: {
            type: 'object',
            properties: {
              address: address.schema(fullSchema, true),
              email: {
                type: 'string',
                format: 'email',
              },
              altEmail: {
                type: 'string',
                format: 'email',
              },
              phoneNumber: phoneSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
