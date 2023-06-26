import { checkConferenceTimes } from '../validations';
import { errorMessages, CONFERENCE_TIMES_V2 } from '../constants';

import {
  InformalConferenceTimesTitleRep,
  InformalConferenceTimesDescriptionRep,
  informalConferenceTimeSelectTitleRep,
} from '../content/InformalConference';

// HLR version 2
export default {
  uiSchema: {
    'ui:title': InformalConferenceTimesTitleRep,
    'ui:description': InformalConferenceTimesDescriptionRep,
    informalConferenceTime: {
      'ui:title': informalConferenceTimeSelectTitleRep,
      'ui:widget': 'radio',
      'ui:required': formData => formData?.informalConference !== 'no',
      'ui:validations': [checkConferenceTimes],
      'ui:errorMessages': {
        required: errorMessages.informalConferenceTimes,
      },
      'ui:options': {
        enableAnalytics: true,
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
