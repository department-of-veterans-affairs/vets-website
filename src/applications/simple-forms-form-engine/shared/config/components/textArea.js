import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';

/**
 * @param {DigitalFormComponent} component
 * @returns {[SchemaOptions, UISchemaOptions]}
 */
export default ({ hint, label }) => [
  webComponentPatterns.textSchema,
  webComponentPatterns.textareaUI({ title: label, hint }),
];
