import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI(
    `${preparerIsVeteran ? 'Your' : 'Veteran’s'} name and date of birth`,
    'Use your legal name as it appears on your government documentation.',
  ),
  veteranFullName: fullNameUI(),
  veteranDateOfBirth: dateOfBirthUI(),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    veteranFullName: fullNameSchema,
    veteranDateOfBirth: dateOfBirthSchema,
  },
  required: ['veteranDateOfBirth'],
};
