import get from 'lodash/get';

/**
 * @param {string} schemaId e.g. `'root_fullName_first'`
 * @param {Object | undefined} formData
 * @returns {{ isEmpty: boolean, hasProperty: boolean }}
 */
export default function getFormDataFromSchemaId(schemaId, formData) {
  if (!schemaId || !formData) {
    return undefined;
  }

  if (schemaId === 'root') {
    return formData;
  }

  const schemaIdParts = schemaId?.replace(/^root_/, '')?.split('_');
  return get(formData, schemaIdParts);
}
