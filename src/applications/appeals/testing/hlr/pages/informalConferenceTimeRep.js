import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

import { checkConferenceTimes } from '../validations';
import { errorMessages, CONFERENCE_TIMES_V3 } from '../constants';

import {
  InformalConferenceTimesTitleRep,
  InformalConferenceTimesDescriptionRep,
  informalConferenceTimeSelectTitleRep,
  informalConferenceTimeSelectHint,
} from '../content/InformalConference';

// HLR version 2 to v3 transition
export default {
  uiSchema: {
    'ui:title': InformalConferenceTimesTitleRep,
    'ui:description': InformalConferenceTimesDescriptionRep,
    informalConferenceTime: {
      ...radioUI({
        title: informalConferenceTimeSelectTitleRep,
        hint: informalConferenceTimeSelectHint,
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
        enum: Object.keys(CONFERENCE_TIMES_V3),
        enumNames: Object.values(CONFERENCE_TIMES_V3).map(
          name => name.labelRep,
        ),
      },
    },
  },
};
