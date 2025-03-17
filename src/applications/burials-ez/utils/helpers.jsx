import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';

import {
  checkboxGroupSchema,
  fullNameUI,
  textUI,
  textSchema,
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

/**
 * Function to generate UI Schema and Schema for death facility information
 * @param {string} facilityKey - Key for death facility in the schema
 * @param {string} facilityName - Name for the facility in UI
 * @returns {Object} - Object containing uiSchema and schema
 */
export const generateDeathFacilitySchemas = (
  facilityKey,
  facilityName = 'Default Facility Name',
) => {
  return {
    uiSchema: {
      'ui:title': generateTitle('Veteran death location details'),
      [facilityKey]: {
        facilityName: textUI({
          title: `Name of ${facilityName}`,
          errorMessages: {
            required: `Enter the Name of ${facilityName}`,
          },
        }),
        facilityLocation: textUI({
          title: `Location of ${facilityName}`,
          hint: 'City and state',
          errorMessages: {
            required: `Enter the city and state of ${facilityName}`,
          },
        }),
      },
    },
    schema: {
      type: 'object',
      properties: {
        [facilityKey]: {
          type: 'object',
          required: ['facilityName', 'facilityLocation'],
          properties: {
            facilityName: textSchema,
            facilityLocation: textSchema,
          },
        },
      },
    },
  };
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
