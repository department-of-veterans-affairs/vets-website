import {
  arrayBuilderItemSubsequentPageTitleUI,
  textUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import {
  benefitSchemaLabels,
  benefitUiLabels,
  ProgramExamples,
} from './helpers';
import { generateHelpText } from '../../helpers';

/** @returns {PageSchema} */
export const studentEducationBenefitsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s education benefits',
    ),
    typeOfProgramOrBenefit: {
      ...checkboxGroupUI({
        title:
          'Does the student currently receive education benefits from any of these programs?',
        labels: benefitUiLabels,
        required: () => false, // must be set for checkboxGroupUI
        description: generateHelpText('Check all that the student receives'),
      }),
    },
    otherProgramOrBenefit: {
      'ui:title':
        'Briefly list any other programs the student receives education benefits from',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'typeOfProgramOrBenefit',
        expandUnderCondition: formData => formData?.other,
        expandedContentFocus: true,
        preserveHiddenData: true,
      },
    },
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
    'ui:options': {
      updateSchema: (formData, formSchema, _uiSchema, index) => {
        const isOtherChecked =
          !!formData?.studentInformation?.[index]?.typeOfProgramOrBenefit
            ?.other || !!formData?.typeOfProgramOrBenefit?.other;
        const required = ['tuitionIsPaidByGovAgency'];
        if (isOtherChecked) required.push('otherProgramOrBenefit');
        return { ...formSchema, required };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['tuitionIsPaidByGovAgency'],
    properties: {
      typeOfProgramOrBenefit: checkboxGroupSchema(benefitSchemaLabels),
      otherProgramOrBenefit: {
        type: 'string',
      },
      tuitionIsPaidByGovAgency: yesNoSchema,
      'view:programExamples': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @returns {PageSchema} */
export const studentEducationBenefitsStartDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s education benefit payments',
    ),
    benefitPaymentDate: {
      ...currentOrPastDateUI(
        'When did the student start receiving education benefit payments?',
      ),
      'ui:required': () => true,
      'ui:options': {
        updateSchema: (formData, schema, _uiSchema, index) => {
          const itemData = formData?.studentInformation?.[index];

          const values = Object.values(itemData?.typeOfProgramOrBenefit || {});
          const typeOfProgramOrBenefit =
            values.includes(false) && !values.some(value => value === true);

          if (typeOfProgramOrBenefit) {
            itemData.benefitPaymentDate = undefined;
            return schema;
          }

          return {
            ...schema,
            required: ['benefitPaymentDate'],
          };
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      benefitPaymentDate: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentProgramInfoPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s education program or school',
    ),
    schoolInformation: {
      name: {
        ...textUI({
          title:
            'What\u2019s the name of the school or trade program the student attends?',
          errorMessages: {
            required: 'Enter the name of the school or trade program',
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
