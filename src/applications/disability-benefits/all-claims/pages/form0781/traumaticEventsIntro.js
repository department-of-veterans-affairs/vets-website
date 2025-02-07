import {
  eventsPageTitle,
  eventsIntroDescription,
} from '../../content/traumaticEventsIntro';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';

export default {
  uiSchema: {
    'ui:title': titleWithTag(eventsPageTitle, form0781HeadingTag),
    'ui:description': eventsIntroDescription,
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
