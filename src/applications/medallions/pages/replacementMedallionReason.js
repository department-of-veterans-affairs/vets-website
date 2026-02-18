import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Replacement medallion'),
    replacementReasonRadio: radioUI({
      title: "Why are you replacing the Veteran's medallion?",
      labels: {
        damaged: 'The medallion is damaged',
        wrongSizeOrType: 'The medallion is the wrong size or type',
        wrongInformation: 'The medallion has wrong information on it',
        neverReceived: 'I never received the medallion',
        stolen: 'The medallion was stolen',
      },
      required: () => true,
      errorMessages: {
        required: 'Please select a response',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      replacementReasonRadio: radioSchema([
        'damaged',
        'wrongSizeOrType',
        'wrongInformation',
        'neverReceived',
        'stolen',
      ]),
    },
  },
};
