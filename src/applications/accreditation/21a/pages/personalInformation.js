import { cloneDeep } from 'lodash';
import {
  fullNameSchema,
  fullNameUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export default {
  uiSchema: {
    fullName: fullNameMiddleInitialUI,
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      dateOfBirth: dateOfBirthSchema,
    },
  },
};
