import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { separationLabelArr, separationLabels } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    doesLiveWithSpouse: {
      type: 'object',
      properties: {
        currentSpouseReasonForSeparation: {
          ...radioSchema(separationLabelArr),
        },
        other: {
          type: 'string',
        },
      },
      required: ['currentSpouseReasonForSeparation'],
    },
  },
};

export const uiSchema = {
  doesLiveWithSpouse: {
    currentSpouseReasonForSeparation: radioUI({
      title: 'Reason you live separately from your spouse',
      labelHeaderLevel: '3',
      labels: separationLabels,
      classNames: 'vads-u-margin-top--4',
    }),
    other: {
      'ui:title': 'Briefly describe why you live separately from your spouse',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'currentSpouseReasonForSeparation',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
        preserveHiddenData: true,
        width: 'xl',
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.other['ui:collapsed']) {
          return {
            ...formSchema,
            required: ['currentSpouseReasonForSeparation'],
          };
        }
        return {
          ...formSchema,
          required: ['currentSpouseReasonForSeparation', 'other'],
        };
      },
    },
  },
};
