/**
 * @module config/index
 * @description Barrel export file for form configuration and transformers
 */

/** @exports {FormConfig} formConfig - Main form configuration object */
export {
  default,
  default as formConfig,
} from '@bio-aquia/21-0779-nursing-home-information/config/form';

/** @exports {Function} transform - Submit transformer function */
export {
  transform,
} from '@bio-aquia/21-0779-nursing-home-information/config/transform';
