import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

import { checkConferenceTimes } from '../validations';
import { errorMessages, CONFERENCE_TIMES_V3 } from '../constants';

import {
  InformalConferenceTimesTitleRep,
  informalConferenceTimeSelectTitleRepOriginal,
  InformalConferenceTimesDescriptionRep,
  informalConferenceTimeSelectTitleRep,
  informalConferenceTimeSelectHint,
  informalConferenceTimeRepReviewField,
} from '../content/InformalConferenceTimes';
import { showNewHlrContent } from '../utils/helpers';

// HLR version 2 to v3 transition
export default {
  uiSchema: {
    'ui:title': InformalConferenceTimesTitleRep,
    'ui:description': InformalConferenceTimesDescriptionRep,
    informalConferenceTime: {
      ...radioUI({
        title: informalConferenceTimeSelectTitleRepOriginal,
        hint: informalConferenceTimeSelectHint,
        required: formData => formData?.informalConference !== 'no',
        errorMessages: {
          required: errorMessages.informalConferenceTimes,
        },
        enableAnalytics: true,
        updateUiSchema: formData => {
          const showNew = showNewHlrContent(formData);
          return {
            'ui:title': showNew
              ? informalConferenceTimeSelectTitleRep
              : informalConferenceTimeSelectTitleRepOriginal,
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
              name => name[showNew ? 'labelRep' : 'label'],
            ),
          };
        },
      },
      'ui:validations': [checkConferenceTimes],
      'ui:reviewField': informalConferenceTimeRepReviewField,
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
