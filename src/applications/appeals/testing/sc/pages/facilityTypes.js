import {
  textUI,
  textSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  facilityTypeTitle,
  facilityTypeTextLabel,
  facilityTypeChoices,
} from '../content/facilityTypes';

const labels = Object.keys(facilityTypeChoices);

export default {
  uiSchema: {
    facilityTypes: {
      ...checkboxGroupUI({
        title: facilityTypeTitle,
        enableAnalytics: true,
        required: false,
        labelHeaderLevel: '3',
        hideOnReview: true,
        labels: facilityTypeChoices,
      }),
      other: textUI(facilityTypeTextLabel),
    },
  },
  schema: {
    type: 'object',
    properties: {
      facilityTypes: {
        type: 'object',
        properties: {
          ...checkboxGroupSchema(labels).properties,
          other: textSchema,
        },
      },
    },
  },
};
