import {
  currencyUI,
  currencySchema,
  titleUI,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import get from 'platform/utilities/data/get';
import { travelerTypeLabels } from '../../../labels';

/** @type {PageSchema} */
export default {
  title: 'Mileage report',
  path: 'expenses/mileage/add',
  depends: formData => formData.claimantNotVeteran === true,
  uiSchema: {
    ...titleUI('Report mileage'),
    traveler: radioUI({
      title: 'Who needed to travel?',
      labels: travelerTypeLabels,
      classNames: 'vads-u-margin-bottom--2',
    }),
    childName: {
      'ui:title': 'Enter the child’s name',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
        expandUnder: 'traveler',
        expandUnderCondition: 'CHILD',
      },
      'ui:required': (form, index) =>
        get(['medicalExpenses', index, 'recipients'], form) === 'DEPENDENT',
    },
    travelLocation: textUI('Travel location'),
    travelMilesTraveled: numberUI('Miles traveled'),
    travelReimbursementAmount: currencyUI('Amount reimbursed from any source'),
  },
  schema: {
    type: 'object',
    required: ['traveler'],
    properties: {
      traveler: radioSchema(Object.keys(travelerTypeLabels)),
      travelLocation: textSchema,
      travelMilesTraveled: numberSchema,
      travelReimbursementAmount: currencySchema,
    },
  },
};
