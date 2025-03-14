import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {[SchemaOptions, UISchemaOptions]} */
export default ({ dateFormat, hint, label }) =>
  dateFormat === 'month_year'
    ? [
        currentOrPastMonthYearDateSchema,
        currentOrPastMonthYearDateUI({ title: label, hint }),
      ]
    : [currentOrPastDateSchema, currentOrPastDateUI({ title: label, hint })];
