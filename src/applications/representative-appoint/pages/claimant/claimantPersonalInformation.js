import { cloneDeep } from 'lodash';
import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const blankSchema = { type: 'object', properties: {} };

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const uiSchema = {
  ...titleUI('Your personal information'),
  applicantName: fullNameMiddleInitialUI,
  applicantDOB: dateOfBirthUI({
    required: true,
  }),
};

export const schema = {
  type: 'object',
  required: ['applicantDOB'],
  properties: {
    titleSchema,
    applicantName: fullNameSchema,
    applicantDOB: dateOfBirthSchema,
  },
};
