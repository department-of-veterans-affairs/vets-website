import { cloneDeep } from 'lodash';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const fullNameMiddleNameHintUI = cloneDeep(fullNameUI());
fullNameMiddleNameHintUI.middle['ui:hint'] =
  'If you do not have a middle name, enter “N/A.”';
fullNameMiddleNameHintUI.middle['ui:required'] = () => true;

/** @type {PageSchema} */
export default {
  title: 'Name and date of birth',
  path: 'name-date-of-birth',
  uiSchema: {
    ...titleUI(
      'Name and date of birth',
      'Use your legal name as it appears on your government documentation. If you do not have a middle name, enter “N/A.”',
    ),
    fullName: fullNameMiddleNameHintUI,
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['dateOfBirth'],
  },
};
