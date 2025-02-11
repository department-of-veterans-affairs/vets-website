import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  eventTypesPageTitle,
  eventTypesDescription,
  eventTypesQuestion,
  eventTypesHint,
} from '../../content/traumaticEventTypes';
import {
  titleWithTag,
  form0781HeadingTag,
  traumaticEventsExamples,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import { TRAUMATIC_EVENT_TYPES } from '../../constants';

export default {
  uiSchema: {
    'ui:title': titleWithTag(eventTypesPageTitle, form0781HeadingTag),
    'ui:description': eventTypesDescription,
    eventTypes: checkboxGroupUI({
      title: eventTypesQuestion,
      hint: eventTypesHint,
      labels: TRAUMATIC_EVENT_TYPES,
      required: false,
    }),
    'view:traumaticEventsInfo': {
      'ui:description': traumaticEventsExamples,
    },
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
  },

  schema: {
    type: 'object',
    properties: {
      eventTypes: checkboxGroupSchema(Object.keys(TRAUMATIC_EVENT_TYPES)),
      'view:traumaticEventsInfo': {
        type: 'object',
        properties: {},
      },
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
