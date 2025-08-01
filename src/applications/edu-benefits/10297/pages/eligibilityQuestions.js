import {
  dateOfBirthSchema,
  dateOfBirthUI,
  radioUI,
  radioSchema,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Answer these questions to see if you may be eligible for the program',
    ),
    dutyRequirement: radioUI({
      title: 'Which of these statements applies to you?',
      labels: {
        atLeast3Years:
          "I'm a Veteran who served at least 3 years (36 months) on active duty",
        byDischarge:
          "I'm a service member within 180 days of discharge who has or will have 3 years (36 months) by their discharge date",
        none: 'None of the above',
      },
      errorMessages: {
        required: 'Select one option',
      },
    }),
    dateOfBirth: dateOfBirthUI({
      title: 'What is your date of birth?',
      errorMessages: { required: 'Enter date of birth' },
    }),
    otherThanDishonorableDischarge: yesNoUI({
      title:
        'Did you receive a discharge under conditions other than dishonorable?',
      errorMessages: {
        required: 'Select one option',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      dutyRequirement: radioSchema(['atLeast3Years', 'byDischarge', 'none']),
      dateOfBirth: dateOfBirthSchema,
      otherThanDishonorableDischarge: yesNoSchema,
    },
    required: [
      'dateOfBirth',
      'dutyRequirement',
      'otherThanDishonorableDischarge',
    ],
  },
};
