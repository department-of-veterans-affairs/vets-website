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
  introParagraph:
    'A brief intro describing when to use this form. This could be 1 to 3 sentences, with no more than 25 words per sentence. This text is styled differently than body copy.',
  moderationState: 'draft',
  title: 'Form with Two Steps',
  plainLanguageHeader: 'Multiple step form',
  ombInfo: {
    expDate: '8/29/2025',
    ombNumber: '1212-1212',
    resBurden: 30,
  },
  whatToKnowBullets: [
    'This is a test bullet',
    'A second example',
    'Maybe even a third one',
  ],
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
    {
      id: 176042,
      type: 'digital_form_list_loop',
      chapterTitle: 'Film History',
      itemNameLabel: 'Name of film',
      maxItems: 9,
      nounPlural: 'films',
      nounSingular: 'film',
      optional: false,
      pages: [
        {
          bodyText:
            "Yes, we can probably look this up somewhere else, but we want to make sure you're paying attention.",
          components: [
            {
              hint: 'The date it was released in theatres.',
              id: '176030',
              label: 'Release date',
              required: true,
              type: 'digital_form_date_component',
              summaryCard: true,
              dateFormat: 'month_year',
            },
          ],
          id: '176031',
          pageTitle: 'When was this film released?',
        },
        {
          bodyText: null,
          components: [
            {
              hint: 'As listed in the credits',
              id: '176032',
              label: 'Name',
              required: true,
              type: 'digital_form_text_input',
              summaryCard: true,
            },
            {
              hint: 'Most characters will not have this',
              id: '276032',
              label: 'Nickname',
              required: false,
              type: 'digital_form_text_input',
              summaryCard: false,
            },
          ],
          id: '176033',
          pageTitle: "What was your character's name?",
        },
        {
          bodyText:
            'Briefly describe what happened to your character in this film.',
          components: [
            {
              hint: null,
              id: '176034',
              label: 'My role',
              required: true,
              type: 'digital_form_text_area',
            },
          ],
          id: '176035',
          pageTitle: 'What did you do in this film?',
        },
        {
          bodyText: null,
          components: [
            {
              hint: null,
              id: '176040',
              label: 'Select the characters you interacted with',
              required: false,
              type: 'digital_form_checkbox',
              responseOptions: [
                {
                  id: '176036',
                  label: 'Luke Skywalker',
                  description: 'The hero of the original trilogy',
                },
                {
                  id: '176037',
                  label: 'Darth Vader/Anakin Skywalker',
                  description: 'SPOILERS!',
                },
                {
                  id: '176038',
                  label: 'Princess Leia',
                  description: null,
                },
                {
                  id: '176039',
                  label: 'Kylo Ren',
                  description: 'Mopey kid',
                },
              ],
            },
          ],
          id: '176041',
          pageTitle: 'Who did you interact with?',
        },
      ],
      sectionIntro:
        'This is the text shown at the start of a required list and loop. It should explain the purpose of the list and loop and how many entries are required for the form.',
    },
    {
      id: 176029,
      type: 'list_loop_employment_history',
      additionalFields: {},
      chapterTitle: "Veteran's employment history",
      pageTitle: 'List & Loop: Employment History',
    },
    {
      id: 172736,
      type: 'digital_form_custom_step',
      chapterTitle: 'My custom step',
      pages: [
        {
          bodyText: 'My custom body text',
          components: [
            {
              hint: 'This is optional hint text',
              label: 'My custom text input',
              required: true,
              type: 'digital_form_text_input',
            },
          ],
          id: '234567',
          pageTitle: 'My custom page',
        },
        {
          bodyText: 'With additonal body text',
          components: [
            {
              hint: null,
              label: 'A text input with no hint text',
              required: true,
              type: 'digital_form_text_input',
            },
            {
              hint: 'This text input is not required',
              label: 'An optional text input',
              required: false,
              type: 'digital_form_text_input',
            },
          ],
          id: '765432',
          pageTitle: 'An additional page',
        },
      ],
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
  introParagraph:
    'If you’re a Veteran, with a service-connected disability, who lost income within the last year due to that disability, this form may be used to apply for reimbursement of that loss.',
  moderationState: 'published',
  title: 'Employment Questionnaire',
  plainLanguageHeader:
    'Provide your employment history and related loss of income',
  ombInfo: {
    expDate: '7/31/2024',
    ombNumber: '2900-0079',
    resBurden: 5,
  },
  whatToKnowBullets: [
    "You'll need your Social Security number or your VA file number.",
    'You will need to provide the information about the position you held in the last year.',
    'You will also need to indicate how much was a loss connected to the service-connected condition.',
    'After you submit this form, we will review and advise you of the decision and your options.',
  ],
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
    {
      id: 162032,
      type: 'digital_form_list_loop',
      additionalFields: {
        optional: true,
      },
      chapterTitle: "Veteran's employment history",
      pageTitle: 'List & Loop',
    },
  ],
};

export default [normalizedForm, employmentQuestionnaire];
