import { checkConferenceTimes } from '../validations';
import { errorMessages } from '../constants';

import {
  InformalConferenceTimesTitle,
  InformalConferenceTimesDescription,
  informalConferenceTimeSelectTitles,
  informalConferenceTimeAllLabels,
} from '../content/InformalConference';

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
          const enums = Object.keys(informalConferenceTimeAllLabels);
          const enumNames = Object.values(informalConferenceTimeAllLabels);
          return {
            type: 'object',
            properties: {
              time1: {
                type: 'string',
                enum: enums.filter(val => val !== time2Setting),
                enumNames: enumNames.filter(
                  label =>
                    label !== informalConferenceTimeAllLabels[time2Setting],
                ),
              },
              time2: {
                type: 'string',
                enum: enums.filter(val => val !== time1Setting),
                enumNames: enumNames.filter(
                  label =>
                    label !== informalConferenceTimeAllLabels[time1Setting],
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
