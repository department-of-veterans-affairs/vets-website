import { checkConferenceTimes } from '../validations';
import {
  errorMessages,
  CONFERENCE_TIMES_V1,
  CONFERENCE_TIMES_V2,
} from '../constants';
import { apiVersion2 } from '../utils/helpers';

import {
  InformalConferenceTimesTitle,
  InformalConferenceTimesDescription,
  informalConferenceTimeSelectTitles,
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
          const data = apiVersion2(formData)
            ? CONFERENCE_TIMES_V2
            : CONFERENCE_TIMES_V1;
          const time1Setting = formData?.informalConferenceTimes?.time1 || '';
          const time2Setting = formData?.informalConferenceTimes?.time2 || '';
          const enums = Object.keys(data);
          const enumNames = Object.values(data).map(name => name.label);
          return {
            type: 'object',
            properties: {
              time1: {
                type: 'string',
                enum: enums.filter(val => val !== time2Setting),
                enumNames: enumNames.filter(
                  label => label !== data[time2Setting]?.label,
                ),
              },
              time2: {
                type: 'string',
                enum: enums.filter(val => val !== time1Setting),
                enumNames: enumNames.filter(
                  label => label !== data[time1Setting]?.label,
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
