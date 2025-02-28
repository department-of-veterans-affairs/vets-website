import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {[SchemaOptions, UISchemaOptions]} */
export default ({ hint, label }) => [
  webComponentPatterns.textSchema,
  webComponentPatterns.textUI({ title: label, hint }),
];
