import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  eventTypesPageTitle,
  eventTypesQuestion,
  eventTypesHint,
} from '../../content/traumaticEventTypes';
import { formTitle } from '../../utils';
import { TRAUMATIC_EVENT_TYPES } from '../../constants';
import { traumaticEventsExamples } from '../../content/form0781';

export const uiSchema = {
  'ui:title': formTitle(eventTypesPageTitle),
  mentalHealth: {
    eventTypes: checkboxGroupUI({
      title: eventTypesQuestion,
      hint: eventTypesHint,
      labels: TRAUMATIC_EVENT_TYPES,
      required: false,
    }),
  },
  'view:traumaticEventsInfo': {
    'ui:description': traumaticEventsExamples,
  },
};

export const schema = {
  type: 'object',
  properties: {
    mentalHealth: {
      type: 'object',
      properties: {
        eventTypes: checkboxGroupSchema(Object.keys(TRAUMATIC_EVENT_TYPES)),
      },
    },
    'view:traumaticEventsInfo': {
      type: 'object',
      properties: {},
    },
  },
};
