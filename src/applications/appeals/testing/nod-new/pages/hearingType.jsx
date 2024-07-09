import React from 'react';

import {
  hearingTypeTitle,
  hearingTypeContent,
  missingHearingTypeErrorMessage,
  hearingTypes,
} from '../content/hearingType';
import { needsHearingType } from '../../../10182/utils/helpers';

const hearingType = {
  uiSchema: {
    hearingTypePreference: {
      'ui:title': hearingTypeTitle,
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

  review: data => ({
    'What type of hearing would you like to request?': hearingTypes[
      data.hearingTypePreference
    ] || (
      <span className="usa-input-error-message">Missing hearing option</span>
    ),
  }),
};

export default hearingType;
