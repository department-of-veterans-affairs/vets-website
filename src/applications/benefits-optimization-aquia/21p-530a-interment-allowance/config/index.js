/**
 * @module config/index
 * @description Barrel export file for configuration modules
 */

/** @exports {FormConfig} formConfig - Main form configuration */
export { formConfig } from './form';

// Also export default for modules that expect it
export { default } from './form';
