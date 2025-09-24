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
 * @property {boolean} [summaryCard]
 * @property {string} type
 */

/**
 * @typedef {Object} ListLoop
 * @property {string} itemNameLabel
 * @property {number} maxItems
 * @property {string} nounPlural
 * @property {string} nounSingular
 * @property {boolean} optional
 * @property {string} sectionIntro
 */

/**
 * @typedef {Object} ListLoopVariation
 * @property {ArrayBuilderOptions} options
 * @property {(pageBuilder: ArrayBuilderPages, helpers?: ArrayBuilderHelpers) => FormConfigChapter} pageBuilderCallback
 */

/**
 * @typedef {{
 *    id: number,
 *    type: string,
 *    chapterTitle: string,
 *    additionalFields?: Record<string, any>,
 *    pageTitle?: string,
 *    pages?: Array<NormalizedPage>,
 * } & Partial<ListLoop>} NormalizedChapter
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
 * @property {Array<DigitalFormComponent>} [components]
 * @property {string} id
 * @property {string} pageTitle
 */

/**
 * @typedef {Object} NormalizedResponseOption
 * @property {string} [description]
 * @property {string} label
 */
