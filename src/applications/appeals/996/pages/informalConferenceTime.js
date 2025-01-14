import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { checkConferenceTimes } from '../validations';
import { errorMessages, CONFERENCE_TIMES_V2_5 } from '../constants';

import {
  InformalConferenceTimesTitle,
  InformalConferenceTimesDescription,
  informalConferenceTimeSelectTitle,
  informalConferenceTimeSelectHint,
  informalConferenceTimeReviewField,
} from '../content/InformalConferenceTimes';

// HLR version 2
export default {
  uiSchema: {
    'ui:title': InformalConferenceTimesTitle,
    'ui:description': InformalConferenceTimesDescription,
    informalConferenceTime: {
      ...radioUI({
        title: informalConferenceTimeSelectTitle,
        required: formData => formData?.informalConference !== 'no',
        errorMessages: {
          required: errorMessages.informalConferenceTimes,
        },
        enableAnalytics: true,
        hint: informalConferenceTimeSelectHint,
      }),
      'ui:validations': [checkConferenceTimes],
      'ui:reviewField': informalConferenceTimeReviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      informalConferenceTime: {
        type: 'string',
        enum: Object.keys(CONFERENCE_TIMES_V2_5),
        enumNames: Object.values(CONFERENCE_TIMES_V2_5).map(
          name => name.labelMe,
        ),
      },
    },
  },
};
