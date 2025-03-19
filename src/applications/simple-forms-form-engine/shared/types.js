/**
 * @file Generic types for the form engine platform
 *
 * Used for intellisense (autocompletion)
 */

// Example 1:
// /** @type {DigitalFormComponent} */
// const component = {...};

/**
 * @typedef {Object} DigitalFormComponent
 * @property {string} [hint]
 * @property {string} label
 * @property {boolean} required
 * @property {Array<NormalizedResponseOption>} [responseOptions]
 */

/**
 * @typedef {Object} NormalizedResponseOption
 * @property {string} [description]
 * @property {string} label
 */
