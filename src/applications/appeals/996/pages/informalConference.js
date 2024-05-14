import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { errorMessages } from '../constants';

import {
  InformalConferenceDescription,
  InformalConferenceTitle,
  informalConferenceLabels,
} from '../content/InformalConference';

const informalConference = {
  uiSchema: {
    informalConference: radioUI({
      title: InformalConferenceTitle,
      labels: informalConferenceLabels,
      descriptions: InformalConferenceDescription,
      enableAnalytics: true,
      errorMessages: {
        required: errorMessages.informalConferenceContactChoice,
      },
      labelHeaderLevel: 3,
    }),
  },
  schema: {
    type: 'object',
    required: ['informalConference'],
    properties: {
      informalConference: radioSchema(['no', 'me', 'rep']),
    },
  },
};

export default informalConference;
