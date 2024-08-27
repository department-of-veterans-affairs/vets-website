import {
  yesNoUI,
  yesNoSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  StudentEducationH3,
  benefitUiLabels,
  benefitSchemaLabels,
  ProgramExamples,
} from './helpers';
import { generateHelpText } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    studentInformation: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          typeOfProgramOrBenefit: checkboxGroupSchema(benefitSchemaLabels),
          tuitionIsPaidByGovAgency: yesNoSchema,
          'view:programExamples': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': StudentEducationH3,
      typeOfProgramOrBenefit: {
        ...checkboxGroupUI({
          title:
            'Does the student currently receive education benefits from any of these programs?',
          labels: benefitUiLabels,
          required: () => true,
          description: generateHelpText('Check all that the student receives'),
        }),
      },
      tuitionIsPaidByGovAgency: {
        ...yesNoUI(
          'Is the student enrolled in a program or school that’s entirely funded by the federal government?',
        ),
        'ui:required': () => true,
      },
      'view:programExamples': {
        'ui:description': ProgramExamples,
      },
    },
  },
};
