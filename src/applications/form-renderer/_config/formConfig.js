/**
 * This file - in its current form - is temporary. We want to temporarily define
 * two `formConfig` objects that can be dynamically chosen based on the url.
 * Eventually, the `formConfig` object that drives the application will
 * be calculated after fetching configuration from Drupal.
 *
 * As such, we purposely do not name this file `form.js` so as to bypass
 * unit testing that automatically takes place on all `config/form.js` files
 * in `src/applications`.
 */

// import fullSchema from 'vets-json-schema/dist/-schema.json';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { dependsOn } from '../utils/conditional';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

export const formConfig1 = {
  rootUrl: `${manifest.rootUrl}/123-abc`,
  urlPrefix: '/123-abc/',
  trackingPrefix: '123-abc-',
  // eslint-disable-next-line no-console
  submit: () => console.log('submit form 1'),
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '123-abc',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Form 1 NOT FOUND',
    noAuth: 'Please sign in again to continue Form 1.',
  },
  title: 'Form 123-ABC',
  defaultDefinitions: {},
  chapters: {
    f1c1: {
      title: 'Form 1 Chapter 1',
      pages: {
        f1c1p1: {
          path: 'f1c1p1',
          title: 'Form 1 Chapter 1 Page 1',
          uiSchema: {
            'ui:title': 'Eligibility',
            'ui:description': 'Requirements',
            isEligible1: {
              'ui:title': 'Are you eligible for Item1?',
              'ui:widget': 'yesNo',
            },
            isEligible2: {
              'ui:title': 'Are you eligible for Item2?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            required: ['isEligible1'],
            properties: {
              isEligible1: {
                type: 'boolean',
              },
              isEligible2: {
                type: 'boolean',
              },
            },
          },
        },
        f1c1p2: {
          depends: dependsOn({
            operator: 'or',
            conditions: [
              {
                field: 'isEligible1',
                value: true,
              },
              {
                field: 'isEligible2',
                value: true,
              },
            ],
          }),
          path: 'f1c1p2',
          title: 'Form 1 Chapter 1 Page 2',
          uiSchema: {
            'ui:title': 'Conditional Page',
            'ui:description': 'Other',
            isOtherEligible: {
              'ui:title': 'Are you eligible for something else?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            required: ['isOtherEligible'],
            properties: {
              isOtherEligible: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
  },
};

// This is a sample of the data structure produced by content-build.
export const normalizedForm = {
  cmsId: 71160,
  formId: '2121212',
  title: 'Form with Two Steps',
  ombInfo: {
    expDate: '8/29/2025',
    ombNumber: '1212-1212',
    resBurden: 30,
  },
  chapters: [
    {
      id: 158253,
      chapterTitle: 'First Step',
      type: 'digital_form_name_and_date_of_bi',
      pageTitle: 'Name and Date of Birth',
      additionalFields: {
        includeDateOfBirth: true,
      },
    },
    {
      id: 158254,
      chapterTitle: 'Second Step',
      type: 'digital_form_name_and_date_of_bi',
      pageTitle: 'Name and Date of Birth',
      additionalFields: {
        includeDateOfBirth: false,
      },
    },
    {
      id: 160592,
      chapterTitle: 'Generated Identification Information',
      type: 'digital_form_identification_info',
      pageTitle: 'Identification Information',
      additionalFields: {
        includeServiceNumber: false,
      },
    },
    {
      id: 161344,
      chapterTitle: 'Generated Address',
      type: 'digital_form_address',
      pageTitle: 'Address',
      additionalFields: {
        militaryAddressCheckbox: false,
      },
    },
    {
      id: 161351,
      chapterTitle: 'Generated Phone',
      type: 'digital_form_phone_and_email',
      pageTitle: 'Phone and email address',
      additionalFields: {
        includeEmail: false,
      },
    },
  ],
};

/**
 * This is a mock of VA Form 21-4140. It will provide a blueprint we can test
 * against, and it will serve as the output goal for Drupal and content-build
 * tickets related to the Form Engine: Recreating VA Form 21-4140 epic.
 */
export const employmentQuestionnaire = {
  cmsId: 10001,
  formId: '21-4140',
  title: 'Employment Questionnaire',
  ombInfo: {
    expDate: '7/31/2024',
    ombNumber: '2900-0079',
    resBurden: 5,
  },
  chapters: [
    {
      id: 20001,
      chapterTitle: "Veteran's personal information",
      type: 'digital_form_name_and_date_of_bi',
      pageTitle: 'Name and Date of Birth',
      additionalFields: {
        includeDateOfBirth: true,
      },
    },
    {
      id: 20002,
      chapterTitle: 'Identification information',
      type: 'digital_form_identification_info',
      pageTitle: 'Identification Information',
      additionalFields: {
        includeServiceNumber: true,
      },
    },
    {
      id: 20003,
      chapterTitle: "Veteran's mailing information",
      type: 'digital_form_address',
      pageTitle: 'Address',
      additionalFields: {
        militaryAddressCheckbox: true,
      },
    },
    {
      id: 20004,
      chapterTitle: "Veteran's contact information",
      type: 'digital_form_phone_and_email',
      pageTitle: 'Phone and email address',
      additionalFields: {
        includeEmail: true,
      },
    },
  ],
};

export default [formConfig1, normalizedForm, employmentQuestionnaire];
