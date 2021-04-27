/**
 * Like Promise.all, but accepts an object instead of an array
 *
 * @export
 * @param {Object} data An object containing promises for each property
 * @returns {Promise<Object>} A promise that returns an object with the same keys
 *   as data, but with the promises resolved
 */
export async function promiseAllFromObject(data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const results = await Promise.all(values);

  return keys.reduce(
    (resultsObj, key, i) => ({
      ...resultsObj,
      [key]: results[i],
    }),
    {},
  );
}
