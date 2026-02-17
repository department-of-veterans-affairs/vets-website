import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import { waiveTrainingPayDescription } from '../content/trainingPayWaiver';
import ConfirmationTrainingPayWaiver from '../components/confirmationFields/ConfirmationTrainingPayWaiver';

export const uiSchema = {
  'ui:title': 'Training pay waiver',
  waiveTrainingPay: yesNoUI({
    title: ' ',
    description: waiveTrainingPayDescription,
    yesNoReverse: true,
    classNames: 'vads-u-margin-top--0',
    labels: {
      Y: "I don't want to get VA compensation pay for the days I receive training pay.",
      N: 'I want to get VA compensation pay instead of training pay.',
    },
    required: () => true,
    errorMessages: {
      required: 'Select an option',
    },
  }),
  'ui:confirmationField': ConfirmationTrainingPayWaiver,
};

export const schema = {
  type: 'object',
  required: ['waiveTrainingPay'],
  properties: {
    waiveTrainingPay: {
      type: 'boolean',
    },
  },
};
