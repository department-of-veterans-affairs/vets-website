import {
  yesNoUI,
  yesNoSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
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
          tuitionIsPaidByGovAgency: yesNoSchema,
          'view:programExamples': {
            type: 'object',
            properties: {},
          },
          typeOfProgramOrBenefit: checkboxGroupSchema(benefitSchemaLabels),
          benefitPaymentDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': StudentEducationH3,
      tuitionIsPaidByGovAgency: {
        ...yesNoUI(
          'Is the student enrolled in a program or school that’s entirely funded by the federal government?',
        ),
        'ui:required': () => true,
      },
      'view:programExamples': {
        'ui:description': ProgramExamples,
        'ui:options': {
          hideOnReview: true,
        },
      },
      typeOfProgramOrBenefit: {
        ...checkboxGroupUI({
          title:
            'Does the student currently receive education benefits from any of these programs?',
          labels: benefitUiLabels,
          required: () => true,
          description: generateHelpText('Check all that the student receives'),
        }),
      },
      benefitPaymentDate: {
        ...currentOrPastDateUI(
          'When did the student start receiving education benefit payments?',
        ),
        'ui:required': (formData, index) => {
          const benefits =
            formData?.studentInformation?.[index]?.typeOfProgramOrBenefit;
          return benefits?.CH35 || benefits?.FECA || benefits?.FRY;
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const benefits =
              formData?.studentInformation?.[index]?.typeOfProgramOrBenefit;
            return !(benefits?.ch35 || benefits?.feca || benefits?.fry);
          },
        },
      },
    },
  },
};
