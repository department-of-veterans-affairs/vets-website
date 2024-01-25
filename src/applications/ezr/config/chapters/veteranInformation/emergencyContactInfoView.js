import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  phoneUI,
  phoneSchema,
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:emergencyContactInformation': {
      ...titleUI(content['emergency-contact-title']),
      first: {
        'ui:title': content['emergency-contact-first-name-label'],
        'ui:options': {
          widgetClassNames: 'form-input-medium',
          uswds: true,
        },
      },
      middle: {
        'ui:title': content['emergency-contact-middle-name-label'],
        'ui:options': {
          widgetClassNames: 'form-input-medium',
          uswds: true,
        },
      },
      last: {
        'ui:title': content['emergency-contact-last-name-label'],
        'ui:options': {
          widgetClassNames: 'form-input-medium',
          uswds: true,
        },
      },
      mobilePhone: phoneUI(content['emergency-contact-phone-number-label']),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:emergencyContactInformation': {
        type: 'object',
        properties: {
          first: {
            type: 'string',
          },
          middle: {
            type: 'string',
          },
          last: {
            type: 'string',
          },
          mobilePhone: phoneSchema,
        },
      },
    },
  },
};
