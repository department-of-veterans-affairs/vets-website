import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

import { checkConferenceTimes } from '../validations';
import { errorMessages, CONFERENCE_TIMES_V2_5 } from '../constants';

import {
  InformalConferenceTimesTitleRep,
  InformalConferenceTimesDescriptionRep,
  informalConferenceTimeSelectTitleRep,
  informalConferenceTimeSelectHint,
  informalConferenceTimeRepReviewField,
} from '../content/InformalConferenceTimes';

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
      'ui:reviewField': informalConferenceTimeRepReviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      informalConferenceTime: {
        type: 'string',
        enum: Object.keys(CONFERENCE_TIMES_V2_5),
        enumNames: Object.values(CONFERENCE_TIMES_V2_5).map(
          name => name.labelRep,
        ),
      },
    },
  },
};
