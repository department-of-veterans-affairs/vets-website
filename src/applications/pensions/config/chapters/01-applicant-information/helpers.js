import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';

import { fullNameUI } from 'platform/forms-system/src/js/web-component-patterns';

import { validateBenefitsIntakeName } from '../../../validation';

export const benefitsIntakeFullNameUI = (formatTitle, uiOptions = {}) => {
  let uiSchema = fullNameUI(formatTitle, uiOptions);
  ['first', 'last'].forEach(part => {
    const validations = [
      ...get([part, 'ui:validations'], uiSchema),
      validateBenefitsIntakeName,
    ];
    uiSchema = set(`${part}.ui:validations`, validations, uiSchema);
  });
  return uiSchema;
};
