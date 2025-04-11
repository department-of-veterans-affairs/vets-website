import {
  textSchema,
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
        other: textSchema,
      },
    },
  },
};

export const uiSchema = {
  doesLiveWithSpouse: {
    currentSpouseReasonForSeparation: radioUI({
      title: 'Reason you live separately from your spouse',
      labelHeaderLevel: '3',
      labels: separationLabels,
      required: () => true,
      classNames: 'vads-u-margin-top--4',
    }),
    other: {
      'ui:title': 'Briefly describe why you live separately from your spouse',
      'ui:webComponentField': VaTextInputField,
      'ui:required': formData =>
        formData?.doesLiveWithSpouse?.currentSpouseReasonForSeparation ===
        'OTHER',
      expandUnder: 'currentSpouseReasonForSeparation',
      expandUnderCondition: 'OTHER',
      preserveHiddenData: true,
      hideIf: formData =>
        formData?.doesLiveWithSpouse?.currentSpouseReasonForSeparation !==
        'OTHER',
      showFieldLabel: true,
      keepInPageOnReview: true,
      classNames: 'vads-u-margin-top--2',
    }),
  },
};
