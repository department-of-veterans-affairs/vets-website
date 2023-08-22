import {
  hearingTypeTitle,
  HearingTypeReviewField,
  hearingTypeContent,
  missingHearingTypeErrorMessage,
} from '../content/hearingType';
import { needsHearingType } from '../utils/helpers';

const hearingType = {
  uiSchema: {
    hearingTypePreference: {
      'ui:title': hearingTypeTitle,
      'ui:reviewField': HearingTypeReviewField,
      'ui:widget': 'radio',
      'ui:required': needsHearingType,
      'ui:options': {
        labels: hearingTypeContent,
        enableAnalytics: true,
      },
      'ui:errorMessages': {
        required: missingHearingTypeErrorMessage,
      },
    },
  },

  schema: {
    type: 'object',
    required: ['hearingTypePreference'],
    properties: {
      hearingTypePreference: {
        type: 'string',
        enum: ['virtual_hearing', 'video_conference', 'central_office'],
      },
    },
  },
};

export default hearingType;
