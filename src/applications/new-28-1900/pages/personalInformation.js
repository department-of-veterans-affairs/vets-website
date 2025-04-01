import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { YOUR_INFORMATION_PAGES_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(YOUR_INFORMATION_PAGES_CONSTANTS.personalInformationPageTitle),
    veteranFullName: fullNameUI(),
    veteranId: ssnOrVaFileNumberNoHintUI(),
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameSchema,
      veteranId: ssnOrVaFileNumberNoHintSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
    required: ['veteranFullName', 'veteranId', 'veteranDateOfBirth'],
  },
};
