import { buildAddress } from './helpers';

/**
 * Combines unit name and address into a single field for legacy format.
 * Transforms unitName and unitAddress into unitNameAndAddress.
 *
 * @param {string} formData - JSON string of form data
 * @returns {string} JSON string with combined unitNameAndAddress field
 */
export function combineUnitNameAddress(formData) {
  const parsedFormData = JSON.parse(formData);
  const { unitName, unitAddress } = parsedFormData;

  // Build the combined string with unit name and/or address
  const parts = [];

  if (unitName) {
    parts.push(unitName);
  }

  if (unitAddress) {
    const formattedAddress = buildAddress(unitAddress);
    parts.push(formattedAddress);
  }

  // Add combined field if we have any parts
  if (parts.length > 0) {
    parsedFormData.unitNameAndAddress = parts.join(', ');
  }

  // Remove the original fields
  delete parsedFormData.unitName;
  delete parsedFormData.unitAddress;

  return JSON.stringify(parsedFormData);
}
