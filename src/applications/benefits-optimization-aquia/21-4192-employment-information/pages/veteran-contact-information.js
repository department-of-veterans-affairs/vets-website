/**
 * @module config/form/pages/veteran-contact-information
 * @description Standard form system configuration for Veteran Contact Information page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranName } from './helpers';

/**
 * Generate page title
 * @param {Object} props - Props object with formData and formContext
 * @param {Object} props.formData - The form data
 * @returns {string} The page title
 */
const getPageTitle = ({ formData }) => {
  // Defensive: getVeteranName handles formData validation
  const veteranName = getVeteranName(formData);
  return `${veteranName}'s Social Security number and VA file number`;
};

/**
 * uiSchema for Veteran Contact Information page
 * Collects veteran's SSN and VA file number
 */
export const veteranContactInformationUiSchema = {
  ...titleUI(getPageTitle),
  veteranContactInformation: ssnOrVaFileNumberUI(),
};

/**
 * JSON Schema for Veteran Contact Information page
 * Validates SSN and VA file number fields
 */
export const veteranContactInformationSchema = {
  type: 'object',
  required: ['veteranContactInformation'],
  properties: {
    veteranContactInformation: ssnOrVaFileNumberSchema,
  },
};
