import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { errorMessages } from '../constants';

import {
  informalConferenceTitle,
  InformalConferenceDescription,
  informalConferenceLabels,
  informalConferenceDescriptions,
} from '../content/InformalConference';

// This is the yes/no choice for requesting an informal conference
// A custom page will override these settings
const informalConferenceChoice = {
  uiSchema: {
    'ui:description': InformalConferenceDescription,
    informalConferenceChoice: radioUI({
      title: informalConferenceTitle,
      labels: informalConferenceLabels,
      descriptions: informalConferenceDescriptions,
      enableAnalytics: true,
      errorMessages: {
        required: errorMessages.requiredYesNo,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['informalConferenceChoice'],
    properties: {
      informalConferenceChoice: radioSchema(['no', 'yes']),
    },
  },
};

export default informalConferenceChoice;
