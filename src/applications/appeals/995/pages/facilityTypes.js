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
  facilityTypeReviewField,
  facilityTypeError,
} from '../content/facilityTypes';
import { validateFacilityTypes } from '../validations/facilityTypes';

const labels = Object.keys(facilityTypeChoices);

export default {
  uiSchema: {
    facilityTypes: {
      ...checkboxGroupUI({
        title: facilityTypeTitle,
        enableAnalytics: true,
        classNames: 'vads-u-margin-bottom--6',
        required: true,
        labelHeaderLevel: '3',
        labels: facilityTypeChoices,
      }),
      other: textUI(facilityTypeTextLabel),
      'ui:objectViewField': facilityTypeReviewField,
      'ui:validations': [validateFacilityTypes],
      'ui:errorMessages': {
        required: facilityTypeError,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['facilityTypes'],
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
