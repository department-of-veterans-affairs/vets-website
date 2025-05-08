import {
  textUI,
  textSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import {
  facilityTypeTitle,
  facilityTypeTextLabel,
  facilityTypeChoices,
  facilityTypeReviewField,
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
        labels: facilityTypeChoices,
      }),
      other: textUI(facilityTypeTextLabel),
      'ui:objectViewField': facilityTypeReviewField,
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
