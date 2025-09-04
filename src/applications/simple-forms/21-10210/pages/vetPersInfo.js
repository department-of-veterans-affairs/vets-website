import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VetPersInfoUiTitle from '../components/VetPersInfoUiTitle';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(VetPersInfoUiTitle),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranDateOfBirth'],
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
