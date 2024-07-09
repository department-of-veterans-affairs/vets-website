import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

const title =
  'Do you want to write or upload additional information about your disagreements?';

const additionalInfoRequest = {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    'view:additionalInfo': yesNoUI({
      title,
      enableAnalytics: true,
      labelHeaderLevel: '1',
      uswds: true,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      'view:additionalInfo': {
        type: 'boolean',
      },
    },
  },

  review: data => ({
    [title]: data['view:additionalInfo'] ? 'Yes' : 'No',
  }),
};

export default additionalInfoRequest;
