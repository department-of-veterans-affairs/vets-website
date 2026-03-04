import {
  arrayBuilderItemSubsequentPageTitleUI,
  textUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
  radioUI,
  radioSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  benefitSchemaLabels,
  benefitUiLabels,
  ProgramExamples,
} from './helpers';

/** @returns {PageSchema} */
export const studentEducationBenefitsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Education benefits'),
    typeOfProgramOrBenefit: radioUI({
      title:
        'Does the student currently receive education benefits from any of these programs?',
      labels: benefitUiLabels,
      required: () => true,
      errorMessages: {
        required: 'Select an education benefit program',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['typeOfProgramOrBenefit'],
    properties: {
      typeOfProgramOrBenefit: radioSchema(benefitSchemaLabels),
    },
  },
};

/** @returns {PageSchema} */
export const studentFederallyFundedPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Federally-funded schools or programs',
    ),
    tuitionIsPaidByGovAgency: {
      ...yesNoUI({
        title:
          'Is the student enrolled in a program or school that\u2019s entirely funded by the federal government?',
        required: () => true,
      }),
    },
    'view:programExamples': {
      'ui:description': ProgramExamples,
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['tuitionIsPaidByGovAgency'],
    properties: {
      tuitionIsPaidByGovAgency: yesNoSchema,
      'view:programExamples': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @returns {PageSchema} */
export const studentProgramInfoPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Education program or school',
    ),
    schoolInformation: {
      name: {
        ...textUI({
          title:
            'What\u2019s the name of the program or school the student attends?',
          errorMessages: {
            required: 'Enter the program name',
          },
        }),
        'ui:required': () => true,
        'ui:options': {
          width: 'xl',
        },
        'ui:validations': [
          (errors, schoolName) => {
            if (schoolName?.length > 80) {
              errors.addError('School name must be 80 characters or less');
            }
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['schoolInformation'],
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
          name: textSchema,
        },
      },
    },
  },
};

/** @returns {PageSchema} */
export const studentEducationBenefitsStartDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Education benefit or program start date',
    ),
    benefitPaymentDate: {
      ...currentOrPastDateUI({
        title:
          'When did this child start receiving these benefits or attending this school or program?',
        description:
          'If they received a benefit and attended a program, provide the earliest start date.',
      }),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      benefitPaymentDate: currentOrPastDateSchema,
    },
  },
};
