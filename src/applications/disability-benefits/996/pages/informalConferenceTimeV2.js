import { checkConferenceTimes } from '../validations';
import { errorMessages, CONFERENCE_TIMES_V2 } from '../constants';

import {
  InformalConferenceTimesTitle,
  InformalConferenceTimesDescriptionV2,
  informalConferenceTimeSelectTitles,
} from '../content/InformalConference';

// HLR version 2
export default {
  uiSchema: {
    'ui:title': InformalConferenceTimesTitle,
    'ui:description': InformalConferenceTimesDescriptionV2,
    informalConferenceTime: {
      'ui:title': informalConferenceTimeSelectTitles.first,
      'ui:widget': 'radio',
      'ui:required': formData => formData?.informalConference !== 'no',
      'ui:validations': [checkConferenceTimes],
      'ui:errorMessages': {
        required: errorMessages.informalConferenceTimes,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      informalConferenceTime: {
        type: 'string',
        enum: Object.keys(CONFERENCE_TIMES_V2),
        enumNames: Object.values(CONFERENCE_TIMES_V2).map(name => name.label),
      },
    },
  },
};
