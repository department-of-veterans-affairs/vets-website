import {
  textUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  eventDetailsPageTitle,
  eventDetailsPrompt,
  eventDetailsHint,
  eventExamplesAdditionalInfo,
  eventLocationQuestion,
  eventLocationHint,
  eventTimingQuestion,
  eventTimingHint,
} from '../../content/traumaticEventDetails';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';

export const uiSchema = index => ({
  'ui:title': titleWithTag(eventDetailsPageTitle, form0781HeadingTag),
  [`event${index}`]: {
    details: textareaUI({
      title: eventDetailsPrompt,
      hint: eventDetailsHint,
    }),
    'view:eventExamplesAdditionalInfo': {
      'ui:description': eventExamplesAdditionalInfo,
    },
    location: textUI({
      title: eventLocationQuestion,
      hint: eventLocationHint,
    }),
    timing: textUI({
      title: eventTimingQuestion,
      hint: eventTimingHint,
    }),
  },
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`event${index}`]: {
      type: 'object',
      properties: {
        details: {
          type: 'string',
        },
        'view:eventExamplesAdditionalInfo': {
          type: 'object',
          properties: {},
        },
        location: {
          type: 'string',
        },
        timing: {
          type: 'string',
        },
      },
    },
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
});
