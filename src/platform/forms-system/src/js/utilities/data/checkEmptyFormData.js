/**
 * Deep get an object data based on parts e.g. `["fullName", "first"]`
 *
 * Returns data as well as if the property exists.
 *
 * @param {any} data `formData`, or a subnode of `formData`
 * @param {string[]} parts schemaId parts split on '_' e.g. ['fullName', 'first']
 * @returns {{ data: any, hasProperty: boolean }}
 */
export function getDataFromIdParts(data, [part, ...remainingParts]) {
  let nodeData;
  const hasProperty = data && Object.prototype.hasOwnProperty.call(data, part);
  if (hasProperty) {
    nodeData = data[part];

    // this works for both objects and arrays
    if (typeof nodeData === 'object' && remainingParts.length) {
      return getDataFromIdParts(nodeData, remainingParts);
    }
  }

  return { data: nodeData, hasProperty };
}

/**
 * Check if formData is empty based on a schemaId.
 *
 * @param {string} schemaId e.g. `'root_fullName_first'`
 * @param {Object | undefined} formData
 * @returns {{ isEmpty: boolean, hasProperty: boolean }}
 */
export default function checkEmptyFormData(schemaId, formData) {
  if (!schemaId || !formData || schemaId === 'root') {
    return { isEmpty: !formData, hasProperty: false };
  }

  const schemaIdParts = schemaId?.split('_')?.slice(1);
  const { data, hasProperty } = getDataFromIdParts(formData, schemaIdParts);
  const isEmpty = hasProperty
    ? data === undefined || data === null || data === ''
    : true;

  return { isEmpty, hasProperty };
}
