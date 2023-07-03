import { errorMessages } from '../constants';

import {
  InformalConferenceDescription,
  InformalConferenceTitle,
  informalConferenceLabels,
} from '../content/InformalConference';

const informalConference = {
  uiSchema: {
    'ui:title': '',
    'ui:description': InformalConferenceDescription,
    informalConference: {
      'ui:title': InformalConferenceTitle,
      'ui:widget': 'radio',
      'ui:options': {
        labels: informalConferenceLabels,
        widgetProps: {
          me: { 'aria-describedby': 'choose-conference-notice' },
          rep: { 'aria-describedby': 'choose-conference-notice' },
        },
        enableAnalytics: true,
      },
      'ui:errorMessages': {
        required: errorMessages.informalConferenceContactChoice,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['informalConference'],
    properties: {
      informalConference: {
        type: 'string',
        enum: ['no', 'me', 'rep'],
      },
    },
  },
};

export default informalConference;
