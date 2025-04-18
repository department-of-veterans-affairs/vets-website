import {
  textUI,
  textareaUI,
  textSchema,
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
import { arrayBuilderEventPageTitleUI } from '../../utils/form0781';

export default {
  uiSchema: {
    'ui:title': arrayBuilderEventPageTitleUI({
      title: titleWithTag(eventDetailsPageTitle, form0781HeadingTag),
      editTitle: 'details',
    }),
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
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
  },
  schema: {
    type: 'object',
    properties: {
      details: textSchema,
      'view:eventExamplesAdditionalInfo': {
        type: 'object',
        properties: {},
      },
      location: textSchema,
      timing: textSchema,
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
