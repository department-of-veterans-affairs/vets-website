import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { separationTypes, separationTypeLabels } from '../constants/benefits';

export default {
  uiSchema: {
    separation: radioUI({
      enableAnalytics: true,
      title: 'How long ago did you separate or retire from service?',
      hint:
        'If you served during multiple periods, please choose the answer that corresponds to your most recent separation.',
      labels: separationTypeLabels,
      required: () => false,
      updateUiSchema: formData => {
        const shouldHide =
          formData.militaryServiceCurrentlyServing === true &&
          formData.militaryServiceCompleted === false;
        return {
          'ui:options': {
            hideOnReview: shouldHide,
          },
        };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      separation: radioSchema(Object.keys(separationTypes)),
    },
  },
};
