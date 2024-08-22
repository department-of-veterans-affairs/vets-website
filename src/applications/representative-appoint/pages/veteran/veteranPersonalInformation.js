import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  descriptionUI,
  descriptionSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI(
    ({ formData }) =>
      `${
        preparerIsVeteran({ formData }) ? 'Your' : 'Veteran’s'
      } name and date of birth`,
  ),
  ...descriptionUI(
    ({ formData }) =>
      `${
        preparerIsVeteran({ formData })
          ? 'Use your legal name as it appears on your government documentation.'
          : 'Use the veteran’s legal name as it appears on their government documentation.'
      }`,
  ),
  veteranFullName: fullNameUI(),
  veteranDateOfBirth: dateOfBirthUI(),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    descriptionSchema,
    veteranFullName: fullNameSchema,
    veteranDateOfBirth: dateOfBirthSchema,
  },
  required: ['veteranDateOfBirth'],
};
