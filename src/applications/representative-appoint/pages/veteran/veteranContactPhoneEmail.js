import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';

export const blankSchema = { type: 'object', properties: {} };

export const uiSchema = {
  ...titleUI(
    `${
      preparerIsVeteran ? 'Your' : 'Veteran’s'
    } phone number and email address`,
  ),
  'Primary phone': phoneUI({
    required: true,
  }),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: ['Primary phone'],
  properties: {
    titleSchema,
    'Primary phone': phoneSchema,
    veteranEmail: emailSchema,
  },
};
