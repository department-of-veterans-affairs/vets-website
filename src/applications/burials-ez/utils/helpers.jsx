import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';

import {
  fullNameUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateBenefitsIntakeName } from './validation';

export const generateTitle = text => {
  return <h3 className="vads-u-margin-top--0 vads-u-color--base">{text}</h3>;
};

export const generateHelpText = (
  text,
  className = 'vads-u-color--gray vads-u-font-size--md',
) => {
  return <span className={className}>{text}</span>;
};

export const checkboxGroupSchemaWithReviewLabels = keys => {
  const schema = checkboxGroupSchema(keys);
  keys.forEach(key => {
    schema.properties[key] = {
      ...schema.properties[key],
      enum: [true, false],
      enumNames: ['Selected', 'Not selected'],
    };
  });
  return schema;
};

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

export const isProductionEnv = () => {
  return (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  );
};

export const showUploadDocuments = () =>
  window.sessionStorage.getItem('showUploadDocuments') === 'true';
