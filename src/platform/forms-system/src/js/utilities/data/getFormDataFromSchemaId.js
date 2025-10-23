import get from 'lodash/get';
import has from 'lodash/has';

/**
 * @param {string} schemaId e.g. `'root_fullName_first'`
 * @param {Object | undefined} formData
 * @returns corresponding value in formData (deeply nested)
 */
export default function getFormDataFromSchemaId(schemaId, formData) {
  if (!schemaId || !formData) {
    return undefined;
  }

  if (schemaId === 'root') {
    return formData;
  }

  const schemaIdParts = schemaId?.replace(/^root_/, '')?.split('_');
  const hasProperty = has(formData, schemaIdParts);
  return hasProperty ? get(formData, schemaIdParts) : 'FORM_DATA_NOT_FOUND';
}
