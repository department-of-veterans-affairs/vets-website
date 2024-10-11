import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import errorMessages from '../../shared/content/errorMessages';

import {
  informalConferenceContactTitle,
  informalConferenceContactInfo,
  informalConferenceContactLabel,
} from '../content/InformalConferenceContact';
import { showNewHlrContent } from '../utils/helpers';

// This is the yes/no choice for requesting an informal conference
// A custom page will override these settings
const informalConferenceChoice = {
  uiSchema: {
    'ui:description': informalConferenceContactInfo,
    informalConferenceChoice: radioUI({
      title: informalConferenceContactTitle,
      required: showNewHlrContent,
      labels: informalConferenceContactLabel,
      enableAnalytics: true,
      errorMessages: {
        required: errorMessages.requiredYesNo,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      informalConferenceChoice: radioSchema(['no', 'yes']),
    },
  },
};

export default informalConferenceChoice;
