import {
  AddIssuesIntroTitle,
  addIssuesIntroLabel,
} from '../content/additionalIssues';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:description': AddIssuesIntroTitle,
    'view:hasIssuesToAdd': {
      'ui:title': addIssuesIntroLabel,
      'ui:widget': 'yesNo',
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:hasIssuesToAdd': {
        type: 'boolean',
      },
    },
  },
};
