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
 * @property {string} id
 * @property {string} label
 * @property {boolean} required
 * @property {Array<NormalizedResponseOption>} [responseOptions]
 * @property {string} type
 */

/**
 * @typedef {Object} ListLoopVariation
 * @property {number} maxItems
 * @property {string} nounPlural
 * @property {string} nounSingular
 * @property {boolean} optional
 * @property {Array<string>} requiredFields
 */

/**
 * @typedef {Object} NormalizedChapter
 * @property {number} id
 * @property {string} type
 * @property {string} chapterTitle
 * @property {Object} [additionalFields]
 * @property {string} [pageTitle]
 * @property {Array<NormalizedPage>} [pages]
 * @property {string} [itemNameLabel]
 * @property {number} [maxItems]
 * @property {boolean} [optional]
 * @property {string} [nounSingular]
 * @property {string} [nounPlural]
 * @property {string} [sectionIntro]
 */

/**
 * @typedef {Object} NormalizedForm
 * @property {Array<NormalizedChapter>} chapters
 * @property {number} cmsId
 * @property {string} formId
 * @property {string} introParagraph
 * @property {string} moderationState
 * @property {Object} ombInfo
 * @property {string} plainLanguageHeader
 * @property {string} title
 * @property {Array<string>} whatToKnowBullets
 */

/**
 * @typedef {Object} NormalizedPage
 * @property {string} [bodyText]
 * @property {Array<Object>} [components]
 * @property {string} id
 * @property {string} pageTitle
 */

/**
 * @typedef {Object} NormalizedResponseOption
 * @property {string} [description]
 * @property {string} label
 */
