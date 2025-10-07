// @ts-check
import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaSelectFieldMapping from './vaSelectFieldMapping';

function optionsList(schema) {
  return schema.enum.map((value, i) => {
    const label = (schema.enumNames && schema.enumNames[i]) || String(value);
    return { label, value };
  });
}

/**
 * Usage uiSchema:
 * ```
 * select: {
 *   'ui:title': 'Select field',
 *   'ui:webComponentField': VaSelectField,
 *   'ui:description': 'description',
 *   'ui:options': {
 *     labels: {
 *       option1: 'Option 1',
 *       option2: 'Option 2',
 *     },
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * select: {
 *   type: 'string',
 *   enum: ['option1', 'option2'],
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaSelectField(props) {
  let addDefaultEntry = false;
  const mappedProps = vaSelectFieldMapping(props);
  const enumOptions =
    (Array.isArray(props.childrenProps.schema.enum) &&
      optionsList(props.childrenProps.schema)) ||
    [];
  const labels = props.uiOptions?.labels || {};

  if (!mappedProps?.uswds) {
    // uswds=true adds a -Select- option by default
    // uswds=false only shows the options so we should add a default option
    addDefaultEntry = true;
  }

  // Check if we have grouped options by looking for objects with 'group' property
  const hasGroups =
    labels &&
    Object.values(labels).some(value => {
      return (
        value !== null &&
        typeof value === 'object' &&
        // @ts-ignore - value is checked to be non-null above
        // eslint-disable-next-line dot-notation
        value['group']
      );
    });

  return (
    <VaSelect
      {...mappedProps}
      value={
        props.childrenProps.formData ??
        props.childrenProps.schema.default ??
        undefined
      }
    >
      {addDefaultEntry &&
        !props.childrenProps.schema.default && <option value="" />}
      {hasGroups
        ? (() => {
            // Group options by their group property
            const groupedOptions = {};
            enumOptions.forEach(option => {
              const labelConfig = labels[option.value];
              let groupName = 'Other';
              let displayLabel = option.label;

              // Handle different label formats
              if (!labelConfig) {
                // Use default label if no config
                displayLabel = option.label;
              } else if (typeof labelConfig === 'string') {
                // Simple string label
                displayLabel = labelConfig;
              } else if (
                typeof labelConfig === 'object' &&
                labelConfig !== null
              ) {
                // Object format with potential group
                // eslint-disable-next-line dot-notation
                if (labelConfig['group']) {
                  // eslint-disable-next-line dot-notation
                  groupName = labelConfig['group'];
                }
                // eslint-disable-next-line dot-notation
                if (labelConfig['label']) {
                  // eslint-disable-next-line dot-notation
                  displayLabel = labelConfig['label'];
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

            return Object.entries(groupedOptions).map(
              ([groupLabel, groupOptions]) => (
                <optgroup key={groupLabel} label={groupLabel}>
                  {groupOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </optgroup>
              ),
            );
          })()
        : enumOptions.map((option, index) => {
            const labelConfig = labels[option.value];
            let displayLabel = option.label;

            if (labelConfig !== null && labelConfig !== undefined) {
              if (
                typeof labelConfig === 'object' &&
                labelConfig !== null &&
                // @ts-ignore - labelConfig is checked to be non-null above
                // eslint-disable-next-line dot-notation
                labelConfig['label']
              ) {
                // eslint-disable-next-line dot-notation
                // @ts-ignore - labelConfig is checked to be non-null above
                // eslint-disable-next-line dot-notation
                displayLabel = labelConfig['label'] || option.label;
              } else if (typeof labelConfig === 'string') {
                displayLabel = labelConfig;
              }
            }

            return (
              <option key={index} value={option.value}>
                {displayLabel}
              </option>
            );
          })}
    </VaSelect>
  );
}

VaSelectField.propTypes = {
  DescriptionField: PropTypes.func,
  childrenProps: PropTypes.object,
  description: PropTypes.string,
  error: PropTypes.string,
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  required: PropTypes.bool,
  textDescription: PropTypes.string,
  uiOptions: PropTypes.object,
};
