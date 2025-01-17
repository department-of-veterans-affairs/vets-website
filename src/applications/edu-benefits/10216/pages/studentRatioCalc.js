// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  numberSchema,
  numberUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PercentageCalc from '../components/PercentageCalc';
import CustomReviewField from '../ReviewPage/CustomReviewField';

export default {
  uiSchema: {
    studentRatioCalcChapter: {
      ...titleUI('35% exemption calculation'),
      beneficiaryStudent: {
        ...numberUI({
          title: 'Number of VA beneficiary students',
          errorMessages: {
            required:
              'Please enter the number of beneficiary students at your institution',
          },
        }),
      },
      numOfStudent: {
        ...numberUI({
          title: 'Total number of students',
          errorMessages: {
            required: 'Please enter the total number of students',
          },
        }),
      },
      studentPercentageCalc: {
        'ui:title': 'VA beneficiary students percentage (calculated)',
        'ui:field': PercentageCalc,
        'ui:reviewField': CustomReviewField,
        'ui:options': {
          classNames: 'vads-u-margin-top--2',
        },
      },
      dateOfCalculation: {
        ...currentOrPastDateUI({
          title: 'Date of calculation',
          hint:
            'Provide the date that the 35% calculation was completed. This must be within 30 calendar days of the term start date.',
          errorMessages: {
            required: 'Please enter a date',
          },
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      studentRatioCalcChapter: {
        type: 'object',
        properties: {
          beneficiaryStudent: numberSchema,
          numOfStudent: numberSchema,
          studentPercentageCalc: {
            type: 'number',
          },
          dateOfCalculation: currentOrPastDateSchema,
        },
        required: ['beneficiaryStudent', 'numOfStudent', 'dateOfCalculation'],
      },
    },
  },
};
