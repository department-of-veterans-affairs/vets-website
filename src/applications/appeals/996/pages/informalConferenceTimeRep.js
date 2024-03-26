import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

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
      ...radioUI({
        title: informalConferenceTimeSelectTitleRep,
        required: formData => formData?.informalConference !== 'no',
        errorMessages: {
          required: errorMessages.informalConferenceTimes,
        },
        enableAnalytics: true,
      }),
      'ui:validations': [checkConferenceTimes],
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
