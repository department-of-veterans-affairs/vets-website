import { checkConferenceTimes } from '../validations';
import { errorMessages, CONFERENCE_TIMES_V1 } from '../constants';

import {
  InformalConferenceTimesTitle,
  InformalConferenceTimesDescription,
  informalConferenceTimeSelectTitles,
} from '../content/InformalConference';

// HLR version 1
export default {
  uiSchema: {
    'ui:title': InformalConferenceTimesTitle,
    'ui:description': InformalConferenceTimesDescription,
    informalConferenceTimes: {
      'ui:title': ' ',
      'ui:options': {
        forceDivWrapper: true,
        updateSchema: formData => {
          const time1Setting = formData?.informalConferenceTimes?.time1 || '';
          const time2Setting = formData?.informalConferenceTimes?.time2 || '';
          const enums = Object.keys(CONFERENCE_TIMES_V1);
          const enumNames = Object.values(CONFERENCE_TIMES_V1).map(
            name => name.label,
          );
          return {
            type: 'object',
            properties: {
              time1: {
                type: 'string',
                enum: enums.filter(val => val !== time2Setting),
                enumNames: enumNames.filter(
                  label => label !== CONFERENCE_TIMES_V1[time2Setting]?.label,
                ),
              },
              time2: {
                type: 'string',
                enum: enums.filter(val => val !== time1Setting),
                enumNames: enumNames.filter(
                  label => label !== CONFERENCE_TIMES_V1[time1Setting]?.label,
                ),
              },
            },
          };
        },
      },
      time1: {
        'ui:title': informalConferenceTimeSelectTitles.first,
        'ui:required': formData => formData?.informalConference !== 'no',
        'ui:validations': [checkConferenceTimes],
        'ui:errorMessages': {
          required: errorMessages.informalConferenceTimes,
        },
      },
      time2: {
        'ui:title': informalConferenceTimeSelectTitles.second,
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      informalConferenceTimes: {
        type: 'object',
        properties: {
          time1: {
            type: 'string',
          },
          time2: {
            type: 'string',
          },
        },
      },
    },
  },
};
