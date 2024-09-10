import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI(
    ({ formData }) =>
      `${
        preparerIsVeteran({ formData }) ? 'Your' : 'Veteran’s'
      } name and date of birth`,
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
