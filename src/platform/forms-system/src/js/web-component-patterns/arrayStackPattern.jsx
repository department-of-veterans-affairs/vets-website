import React from 'react';
import { VaFileInputField } from '../web-component-fields';

/**
 * Creates a default viewField component for an array stack.
 * Renders each field value as a labeled row, resolving display labels
 * via labelMaps -> field ui:options.labels -> raw value.
 * Automatically detects file input fields and renders the filename.
 *
 * @param {Object} config
 * @param {Object} config.fields - Map of field names to uiSchema objects
 * @param {Object} [config.labelMaps] - Map of field names to { value: label } maps
 * @returns {React.ComponentType}
 */
export const createDefaultViewField = ({ fields, labelMaps }) => {
  const fieldEntries = Object.entries(fields).map(([key, fieldUI]) => ({
    key,
    title: fieldUI?.['ui:title'] || key,
    labelMap: labelMaps?.[key] || fieldUI?.['ui:options']?.labels,
    isFileInput: fieldUI?.['ui:webComponentField'] === VaFileInputField,
  }));

  const DefaultViewField = ({ formData }) => (
    <div>
      {fieldEntries.map(({ key, title, labelMap, isFileInput }) => {
        const value = formData?.[key];
        if (!value) return null;

        if (isFileInput) {
          return (
            <h4 key={key} className="vads-u-margin-top--0 vads-u-font-size--h3">
              {value?.name || 'No file'}
            </h4>
          );
        }

        const displayValue = labelMap?.[value] || value;
        return (
          <div key={key}>
            <span className="vads-u-color--gray">{title}</span>
            {': '}
            {displayValue}
          </div>
        );
      })}
    </div>
  );

  DefaultViewField.displayName = 'DefaultArrayStackViewField';
  return DefaultViewField;
};

/**
 * uiSchema for an inline array with card-style items.
 *
 * Provides sensible defaults for all array ui:options (review mode,
 * save button, confirm remove, etc.) and auto-generates a viewField
 * that displays each field's value with its title label.
 *
 * Usage:
 * ```js
 * disabilityExams: arrayStackUI({
 *   nounSingular: 'exam date',
 *   fields: {
 *     disabilityExamDate: {
 *       'ui:title': 'When was your exam?',
 *       'ui:webComponentField': VaMemorableDateField,
 *     },
 *   },
 * })
 * ```
 *
 * @param {Object} options
 * @param {string} options.nounSingular - Noun for the item (e.g. 'exam date'). Used in buttons, labels, remove modal.
 * @param {Object} options.fields - Map of field names to uiSchema objects for each array item.
 * @param {React.ComponentType} [options.viewField] - Custom viewField override. If omitted, auto-generates one from fields.
 * @param {function} [options.getItemName] - Function (item) => string for card title / aria. Defaults to () => nounSingular.
 * @param {function} [options.isItemIncomplete] - Function (item) => boolean marking incomplete items.
 * @param {Object} [options.labelMaps] - Map of field names to { value: label } maps for viewField display.
 * @param {Object} [options.text] - Text overrides: deleteDescription, deleteYes, deleteNo, deleteTitle.
 * @param {Object} [options.arrayOptions] - Override/extend array-level ui:options.
 * @param {Object} [options.itemsOptions] - Override items-level ui:options.
 * @returns {UISchemaOptions}
 */
export const arrayStackUI = options => {
  const {
    nounSingular,
    fields,
    viewField,
    getItemName,
    isItemIncomplete,
    labelMaps,
    text = {},
    arrayOptions,
    itemsOptions,
  } = options;

  const resolvedViewField =
    viewField || createDefaultViewField({ fields, labelMaps });

  const defaultText = {
    getItemName: () => nounSingular,
    deleteDescription: `This will remove this ${nounSingular} from your list.`,
  };

  const resolvedText = { ...defaultText, ...text };

  return {
    'ui:options': {
      itemName: nounSingular,
      itemAriaLabel: resolvedText.getItemName
        ? formData => resolvedText.getItemName(formData) || nounSingular
        : undefined,
      viewField: resolvedViewField,
      keepInPageOnReview: true,
      customTitle: ' ',
      confirmRemove: true,
      confirmRemoveDescription: resolvedText.deleteDescription,
      useDlWrap: true,
      showSave: true,
      reviewMode: true,
      reviewItemHeaderLevel: '4',
      useVaCards: true,
      getItemName: getItemName || resolvedText.getItemName,
      ...(isItemIncomplete && { isItemIncomplete }),
      ...arrayOptions,
    },
    items: {
      'ui:options': {
        classNames: 'vads-u-margin-left--1p5',
        ...itemsOptions,
      },
      ...fields,
    },
  };
};

/**
 * Schema for arrayStackUI.
 *
 * Usage:
 * ```js
 * disabilityExams: arrayStackSchema({
 *   fields: { disabilityExamDate: commonDefinitions.date },
 *   maxItems: 5,
 * })
 * ```
 *
 * @param {Object} options
 * @param {Object} options.fields - Map of field names to JSON schema objects.
 * @param {number} [options.minItems=1] - Minimum array items.
 * @param {number} [options.maxItems] - Maximum array items.
 * @returns {SchemaOptions}
 */
export const arrayStackSchema = (options = {}) => {
  const { fields = {}, minItems = 1, maxItems } = options;

  return {
    type: 'array',
    minItems,
    ...(maxItems !== undefined && { maxItems }),
    items: {
      type: 'object',
      properties: { ...fields },
    },
  };
};
