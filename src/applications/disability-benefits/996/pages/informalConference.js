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
        updateSchema: (formData, schema) => {
          const choice = formData?.informalConference;
          const article = document.querySelector('article');
          // informalConferenceTimes title needs to know this setting, so we'll
          // use CSS to control the view instead of doing some complicated form
          // data manipulation
          if (choice && article) {
            // no article available in unit tests
            article.dataset.contactChoice = choice;
          }
          return schema;
        },
        widgetProps: {
          me: { 'aria-describedby': 'choose-conference-notice' },
          rep: { 'aria-describedby': 'choose-conference-notice' },
        },
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
