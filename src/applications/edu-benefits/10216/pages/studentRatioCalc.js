// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import {
  textUI,
  currentOrPastDateUI,
  textSchema,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PercentageCalc from '../components/PercentageCalc';
import { ratioCalcInfoHelpText } from '../components/RatioCalc';

export default {
  uiSchema: {
    studentRatioCalcChapter: {
      ...titleUI('35% exemption calculation'),
      beneficiaryStudent: {
        ...textUI({
          title: 'Number of VA beneficiary students',
          errorMessages: {
            required:
              'Please enter the number of beneficiary students at your institution',
          },
        }),
      },
      numOfStudent: {
        ...textUI({
          title: 'Total number of students',
          errorMessages: {
            required: 'Please enter the total number of students',
          },
        }),
      },
      studentPercentageCalc: {
        'ui:title': 'VA beneficiary students percentage (calculated)',
        'ui:description': PercentageCalc,
      },

      'view:ratioCalcInfoHelpText': {
        'ui:description': ratioCalcInfoHelpText,
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
          beneficiaryStudent: textSchema,
          numOfStudent: textSchema,
          studentPercentageCalc: { type: 'object', properties: {} },
          'view:ratioCalcInfoHelpText': {
            type: 'object',
            properties: {},
          },
          dateOfCalculation: currentOrPastDateSchema,
        },
        required: ['beneficiaryStudent', 'numOfStudent', 'dateOfCalculation'],
      },
    },
  },
};
