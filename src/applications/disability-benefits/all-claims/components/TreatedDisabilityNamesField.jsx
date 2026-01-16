import React from 'react';
import PropTypes from 'prop-types';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { capitalizeEachWord } from '../utils';

// aggregates conditions and rated disabilities
const aggregateConditionsAndRatedDisabilities = (formData = {}) => {
  const ratedDisabilities = Array.isArray(formData.ratedDisabilities)
    ? formData.ratedDisabilities
    : [];

  const newDisabilities = Array.isArray(formData.newDisabilities)
    ? formData.newDisabilities
    : [];

  const normalize = val => (typeof val === 'string' ? val.trim() : '');

  // rated disabilities from the current workflow (view:selected)
  const fromRatedDisabilities = ratedDisabilities
    .filter(d => d && d['view:selected'])
    .map(d => normalize(d.name))
    .filter(d => d.length > 0);

  // conditions and rated disabilities found in newDisabilities
  // (in the new workflow, rated disabilities are included in this array)
  const fromNewDisabilities = newDisabilities
    .filter(d => d && typeof d === 'object')
    .map(d => {
      const condition = normalize(d.condition).toLowerCase();
      const side = normalize(d.sideOfBody);
      const ratedDisability = normalize(d.ratedDisability);

      if (!condition) {
        return '';
      }

      if (ratedDisability) {
        return ratedDisability;
      }

      // new conditions may have a laterality (side of body)
      if (side) {
        return `${condition}, ${side.toLowerCase()}`;
      }

      return condition;
    })
    .filter(d => d.length > 0);

  // Combine and deduplicate
  const combined = [...fromRatedDisabilities, ...fromNewDisabilities];
  const unique = [...new Set(combined.map(d => d.toLowerCase()))];

  return unique.map(d => capitalizeEachWord(d));
};

/**
 * Custom field component for treatedDisabilityNames that renders checkboxes
 * for both new conditions and rated disabilities from either workflow.
 */
const TreatedDisabilityNamesField = props => {
  const { formData, onChange } = props;

  // Get all available disabilities
  const allDisabilities = aggregateConditionsAndRatedDisabilities(formData);

  // Create options for the checkbox group
  const options = allDisabilities.map(name => ({
    label: name,
    value: name,
  }));

  // Get current selected values from field data
  const currentValues = props.value || {};
  const selectedValues = Object.keys(currentValues)
    .filter(key => currentValues[key] === true)
    .map(key => {
      // Convert back from sippableId format if needed
      return key;
    });

  const handleChange = selectedItems => {
    // Convert selected items back to the checkbox object format
    const newValue = {};
    options.forEach(option => {
      newValue[option.value] = selectedItems.includes(option.value);
    });
    onChange(newValue);
  };

  return (
    <VaCheckboxGroupField
      {...props}
      options={options}
      value={selectedValues}
      onChange={handleChange}
    />
  );
};

TreatedDisabilityNamesField.propTypes = {
  formData: PropTypes.object,
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export default TreatedDisabilityNamesField;
