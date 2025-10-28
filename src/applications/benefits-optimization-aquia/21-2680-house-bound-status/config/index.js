/**
 * @module config/index
 * @description Barrel export file for form configuration and transformers
 */

/** @exports {FormConfig} formConfig - Main form configuration object */
export { formConfig } from './form';

/** @exports {Function} prefillTransformer - Prefill transformer function */
export { prefillTransformer } from './prefill-transformer';

/** @exports {Function} submitTransformer - Submit transformer function */
export { submitTransformer } from './submit-transformer';
