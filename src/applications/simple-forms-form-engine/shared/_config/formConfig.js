/**
 * This file defines form objects that help build and test the Form Renderer.
 * In a real use-case scenario, the `formConfig` object will
 * be calculated after fetching configuration from Drupal.
 *
 * As such, we purposely do not name this file `form.js` so as to bypass
 * unit testing that automatically takes place on all `config/form.js` files
 * in `src/applications`.
 */

// Here is an example of conditional pages:
//
// import { dependsOn } from '../utils/conditional';
// chapters: {
//   chapter1: {
//     title: 'Chapter 1',
//     pages: {
//       page1: {
//         depends: dependsOn({
//           operator: 'or',
//           conditions: [
//             {
//               field: 'isEligible1',
//               value: true,
//             },
//             {
//               field: 'isEligible2',
//               value: true,
//             },
//           ],
//         }),
//       },
//     },
//   },
// },

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
      id: 162008,
      type: 'digital_form_your_personal_info',
      chapterTitle: 'Your personal information',
      pages: [
        {
          pageTitle: 'Name',
          includeDateOfBirth: false,
        },
        {
          pageTitle: 'Identification information',
          includeServiceNumber: false,
        },
      ],
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
      id: 162013,
      type: 'digital_form_your_personal_info',
      chapterTitle: 'Your personal information',
      pages: [
        {
          pageTitle: 'Name and date of birth',
          includeDateOfBirth: true,
        },
        {
          pageTitle: 'Identification information',
          includeServiceNumber: true,
        },
      ],
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

export default [normalizedForm, employmentQuestionnaire];
