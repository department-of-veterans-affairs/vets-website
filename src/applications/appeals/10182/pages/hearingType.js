import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  hearingTypeTitle,
  HearingTypeReviewField,
  hearingTypeLabels,
  hearingTypeDescriptions,
  missingHearingTypeErrorMessage,
} from '../content/hearingType';
import { needsHearingType } from '../utils/helpers';

const hearingType = {
  uiSchema: {
    hearingTypePreference: {
      ...radioUI({
        title: hearingTypeTitle,
        labelHeaderLevel: '3',
        labels: hearingTypeLabels,
        descriptions: hearingTypeDescriptions,
        required: needsHearingType,
        enableAnalytics: true,
        errorMessages: {
          required: missingHearingTypeErrorMessage,
        },
      }),
      'ui:reviewField': HearingTypeReviewField,
    },
  },

  schema: {
    type: 'object',
    required: ['hearingTypePreference'],
    properties: {
      hearingTypePreference: radioSchema([
        'virtual_hearing',
        'video_conference',
        'central_office',
      ]),
    },
  },
};

export default hearingType;
