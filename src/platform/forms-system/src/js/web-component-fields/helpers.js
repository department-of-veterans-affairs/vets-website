import React from 'react';
/**
 * Convert schema.enum and schema.enumNames to an array of option objects
 * @param {Object} schema
 * @returns {Array<{label: string, value: string}>}
 */
export function schemaToEnumOptions(schema) {
  return schema.enum.map((value, i) => {
    const label = (schema.enumNames && schema.enumNames[i]) || String(value);
    return { label, value };
  });
}

/**
 * Check if labels config contains any group definitions
 * @param {UISchemaOptions['ui:options']['labels']} labels
 * @returns {boolean}
 */
function hasGroups(labels) {
  return (
    labels &&
    Object.values(labels).some(
      value => value !== null && typeof value === 'object' && value.group,
    )
  );
}

/**
 * Group enumOptions by their group property in labels config
 * @param {Array} enumOptions
 * @param {UISchemaOptions['ui:options']['labels']} labels
 * @returns {Object}
 */
function groupEnumOptions(enumOptions, labels) {
  const groupedOptions = {};
  enumOptions.forEach(option => {
    const labelConfig = labels[option.value];
    let groupName = 'Other';
    let displayLabel = option.label;

    if (!labelConfig) {
      displayLabel = option.label;
    } else if (typeof labelConfig === 'string') {
      displayLabel = labelConfig;
    } else if (typeof labelConfig === 'object' && labelConfig !== null) {
      if (labelConfig.group) {
        groupName = labelConfig.group;
      }
      if (labelConfig.label) {
        displayLabel = labelConfig.label;
      }
    }

    if (!groupedOptions[groupName]) {
      groupedOptions[groupName] = [];
    }
    groupedOptions[groupName].push({
      value: option.value,
      label: displayLabel,
    });
  });
  return groupedOptions;
}

/**
 * Render grouped options as React optgroup/option elements
 * @param {Object} groupedOptions
 * @returns {Array}
 */
function renderGroupedOptions(groupedOptions) {
  return Object.entries(groupedOptions).map(([groupLabel, groupOptions]) => (
    <optgroup key={groupLabel} label={groupLabel}>
      {groupOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </optgroup>
  ));
}

/**
 * Render flat options as React option elements
 * @param {Array} enumOptions
 * @param {UISchemaOptions['ui:options']['labels']} labels
 * @returns {Array}
 */
function renderFlatOptions(enumOptions, labels) {
  return enumOptions.map((option, index) => {
    const labelConfig = labels[option.value];
    let displayLabel = option.label;

    if (labelConfig !== null && labelConfig !== undefined) {
      if (
        typeof labelConfig === 'object' &&
        labelConfig !== null &&
        labelConfig.label
      ) {
        displayLabel = labelConfig.label || option.label;
      } else if (typeof labelConfig === 'string') {
        // Use labelConfig only if it's a truthy string, otherwise fall back to option.label
        displayLabel = labelConfig || option.label;
      }
    }
    return (
      <option key={index} value={option.value}>
        {displayLabel}
      </option>
    );
  });
}

/**
 * Render options from schema and labels configuration
 * @param {Object} schema - The schema object containing enum and enumNames
 * @param {UISchemaOptions['ui:options']['labels']} labels - The labels configuration object
 * @returns {Array} - Array of React option or optgroup elements
 */
export function renderOptions(schema, labels = {}) {
  const enumOptions =
    (Array.isArray(schema?.enum) && schemaToEnumOptions(schema)) || [];

  if (hasGroups(labels)) {
    const groupedOptions = groupEnumOptions(enumOptions, labels);
    return renderGroupedOptions(groupedOptions);
  }
  return renderFlatOptions(enumOptions, labels);
}
