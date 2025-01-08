import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { errorMessages } from '../constants';

import {
  newInformalConferenceTitle,
  InformalConferenceDescription,
  newInformalConferenceLabels,
  informalConferenceDescriptions,
} from '../content/InformalConference';
import { validateConferenceChoice } from '../validations';

const informalConference = {
  uiSchema: {
    'ui:description': InformalConferenceDescription,
    informalConference: {
      ...radioUI({
        title: newInformalConferenceTitle,
        labels: newInformalConferenceLabels,
        descriptions: informalConferenceDescriptions,
        enableAnalytics: true,
        errorMessages: {
          required: errorMessages.informalConferenceContactChoice,
        },
      }),
      'ui:validations': [validateConferenceChoice],
    },
  },
  schema: {
    type: 'object',
    required: ['informalConference'],
    properties: {
      informalConference: radioSchema(['me', 'rep']),
    },
  },
};

export default informalConference;
