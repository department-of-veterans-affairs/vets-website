import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { checkConferenceTimes } from '../validations';
import { errorMessages, CONFERENCE_TIMES_V3 } from '../constants';

import {
  InformalConferenceTimesTitle,
  InformalConferenceTimesDescription,
  informalConferenceTimeSelectTitle,
  informalConferenceTimeSelectTitleOriginal,
  informalConferenceTimeSelectHint,
  informalConferenceTimeReviewField,
} from '../content/InformalConferenceTimes';
import { showNewHlrContent } from '../utils/helpers';

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
        updateUiSchema: formData => {
          const showNew = showNewHlrContent(formData);
          return {
            'ui:title': showNew
              ? informalConferenceTimeSelectTitle
              : informalConferenceTimeSelectTitleOriginal,
            'ui:options': {
              hint: showNew ? informalConferenceTimeSelectHint : '',
            },
          };
        },
      }),
      'ui:options': {
        updateSchema: (formData, schema) => {
          const showNew = showNewHlrContent(formData);
          return {
            ...schema,
            enumNames: Object.values(CONFERENCE_TIMES_V3).map(
              name => name[showNew ? 'labelMe' : 'label'],
            ),
          };
        },
      },
      'ui:validations': [checkConferenceTimes],
      'ui:reviewField': informalConferenceTimeReviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      informalConferenceTime: {
        type: 'string',
        enum: Object.keys(CONFERENCE_TIMES_V3),
        enumNames: Object.values(CONFERENCE_TIMES_V3).map(name => name.label),
      },
    },
  },
};
