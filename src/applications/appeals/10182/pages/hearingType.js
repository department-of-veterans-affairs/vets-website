import {
  hearingTypeContent,
  missingHearingTypeErrorMessage,
} from '../content/hearingType';
import { needsHearingType } from '../utils/helpers';

const hearingType = {
  uiSchema: {
    hearingTypePreference: {
      'ui:title': 'What type of hearing would you like to request?',
      'ui:widget': 'radio',
      'ui:required': needsHearingType,
      'ui:options': {
        labels: hearingTypeContent,
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
