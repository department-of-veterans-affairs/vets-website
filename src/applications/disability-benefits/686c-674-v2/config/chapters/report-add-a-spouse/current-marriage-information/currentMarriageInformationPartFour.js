import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
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
    },
  },
};

export const uiSchema = {
  doesLiveWithSpouse: {
    currentSpouseReasonForSeparation: {
      ...radioUI({
        title: 'Reason you live separately from your spouse',
        labelHeaderLevel: '3',
        labels: separationLabels,
        required: () => true,
        classNames: 'vads-u-margin-top--4',
      }),
    },
    other: {
      'ui:required': formData =>
        formData?.doesLiveWithSpouse?.currentSpouseReasonForSeparation ===
        'OTHER',
      'ui:title': 'Briefly describe why you live separately',
      'ui:options': {
        expandUnder: 'currentSpouseReasonForSeparation',
        expandUnderCondition: 'OTHER',
        showFieldLabel: true,
        keepInPageOnReview: true,
        classNames: 'vads-u-margin-top--2',
        // widgetClassNames: 'vads-u-margin-y--0',
      },
    },
  },
};
