import {
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedallionsDescription } from '../components/MedallionsDescription';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your organization'),
    'ui:description': formContext => MedallionsDescription(formContext),
    yourOrganizationText: textUI({
      title:
        'Enter the name of the Veterans Service Organization (VSO) you represent',
    }),
  },

  schema: {
    type: 'object',
    properties: {
      yourOrganizationText: {
        type: 'string',
        maxLength: 60,
      },
    },
    required: ['yourOrganizationText'],
  },
};
