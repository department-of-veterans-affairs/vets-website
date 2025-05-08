import {
  radioSchema,
  radioUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { errorMessages } from '../constants';

import {
  InformalConferenceTitle,
  InformalConferenceDescription,
  informalConferenceHint,
  informalConferenceLabels,
  informalConferenceDescriptions,
} from '../content/InformalConference';

const informalConference = {
  uiSchema: {
    'ui:description': InformalConferenceDescription,
    informalConference: radioUI({
      title: InformalConferenceTitle,
      hint: informalConferenceHint,
      labels: informalConferenceLabels,
      descriptions: informalConferenceDescriptions,
      enableAnalytics: true,
      errorMessages: {
        required: errorMessages.informalConferenceContactChoice,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['informalConference'],
    properties: {
      informalConference: radioSchema(['me', 'rep', 'no']),
    },
  },
};

export default informalConference;
