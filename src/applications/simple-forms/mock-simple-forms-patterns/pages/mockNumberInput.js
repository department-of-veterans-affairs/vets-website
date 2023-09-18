import { VaNumberInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  inlineTitleSchema,
  inlineTitleUI,
  titleSchema,
  titleUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
    numberOld: currencyUI('Currency'),
    'view:wcv1Title': inlineTitleUI('Web component v1'),
    wcv1NumberDecimal: {
      'ui:title': 'VaNumberInputField - decimal',
      'ui:webComponentField': VaNumberInputField,
      'ui:description': 'Text description',
      'ui:errorMessages': {
        pattern: 'Please enter a valid number',
      },
      'ui:options': {
        uswds: false,
        currency: true,
        width: 'md',
        inputmode: 'decimal',
      },
    },
    wcv1NumberNumeric: {
      'ui:title': 'VaNumberInputField - numeric',
      'ui:webComponentField': VaNumberInputField,
      'ui:description': 'Text description',
      'ui:errorMessages': {
        pattern: 'Please enter a valid number',
      },
      'ui:options': {
        uswds: false,
        width: 'sm',
      },
    },
    'view:wcv3Title': inlineTitleUI('Web component v3'),
    wcv3NumberNumeric: numberUI({
      title: 'VaNumberInputField - numeric',
      description: 'Text description',
      hint: 'Hint text',
      width: 'xs',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      numberOld: {
        type: 'number',
      },
      'view:wcv1Title': inlineTitleSchema,
      wcv1NumberDecimal: {
        type: 'string',
        pattern: '^\\d*(\\.\\d+)?$',
      },
      wcv1NumberNumeric: {
        type: 'string',
        pattern: '^\\d*$',
      },
      'view:wcv3Title': inlineTitleSchema,
      wcv3NumberNumeric: numberSchema,
    },
    required: [],
  },
};
