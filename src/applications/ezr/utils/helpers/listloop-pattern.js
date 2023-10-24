/**
 * Helper that takes query params and sets labels and return paths for
 * the multiresponse (list/loop) information pages
 * @param {Object} props - the original dataset, key name, localData object,
 * search index, view field object and ref item for the src array
 * @returns {Object} - the dataset to return
 */
export function getDataToSet(props) {
  const { slices, datakey, localData, listRef, viewFields } = props;
  return localData === null
    ? { [datakey]: listRef, [viewFields.add]: null, [viewFields.skip]: true }
    : { [datakey]: [...slices.beforeIndex, localData, ...slices.afterIndex] };
}

/**
 * Helper that takes query params and sets labels and return paths for
 * the multiresponse (list/loop) information pages
 * @param {Object} params - the URL Search Params object to query
 * @param {String} returnPath - the path to return upon completing an update action
 * @returns {Object} - the labels, returnPath and action mode
 */
export function getSearchAction(params, returnPath) {
  const mode = params.get('action') || 'add';
  return {
    mode,
    label: `${mode === 'add' ? 'add' : 'edit'}ing`,
    pathToGo: mode === 'update' ? '/review-and-submit' : `/${returnPath}`,
  };
}

/**
 * Helper that takes query params and looks for an associated index in the
 * provided array
 * @param {Object} params - the URL Search Params object to query
 * @param {Array} array - the array from which to find the index value
 * @returns {Number} - the desired index of the array
 */
export function getSearchIndex(params, array = []) {
  let indexToReturn = parseInt(params.get('index'), 10);
  if (Number.isNaN(indexToReturn) || indexToReturn > array.length) {
    indexToReturn = array.length;
  }
  return indexToReturn;
}
