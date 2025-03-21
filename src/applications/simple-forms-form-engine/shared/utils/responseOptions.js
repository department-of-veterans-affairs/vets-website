/**
 *
 * @param {Array<NormalizedResponseOption>} responseOptions
 * @returns {boolean}
 */
export const hasDescriptions = responseOptions =>
  responseOptions.some(option => !!option.description);
