import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaCheckbox,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const extractDisabilityLabels = fullData => {
  const candidates = fullData?.disabilityDescription || [];

  const labels = candidates
    .map(entry => {
      if (entry && typeof entry === 'object') {
        return entry.disability;
      }
    })
    .filter(item => typeof item === 'string' && item.trim().length);

  return Array.from(new Set(labels));
};

const arraysEqual = (first = [], second = []) => {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((value, index) => value === second[index]);
};

const coerceSelections = (value, options) => {
  if (Array.isArray(value)) {
    return value.filter(
      item => typeof item === 'string' && options.includes(item),
    );
  }
  return [];
};

const ConnectedDisabilitiesFieldDebug = props => {
  const {
    formData,
    schema,
    uiSchema,
    idSchema,
    errorSchema,
    required,
    disabled,
    readonly,
    onChange,
  } = props;

  // Get the full form data from Redux store
  const fullFormData = useSelector(state => state?.form?.data || {});

  const options = useMemo(() => {
    // Extract disabilities from the full form data
    const disabilitiesFromFullData = extractDisabilityLabels(fullFormData);

    return disabilitiesFromFullData.length > 0
      ? disabilitiesFromFullData
      : [];
  }, [fullFormData]);

  const selections = useMemo(() => {
    return Array.isArray(formData)
      ? formData.filter(item => typeof item === 'string')
      : [];
  }, [formData]);

  useEffect(() => {
    const coerced = coerceSelections(formData, options);
    const needsNormalization =
      !Array.isArray(formData) || !arraysEqual(coerced, selections);
    if (needsNormalization) {
      onChange(coerced);
    }
  }, [formData, onChange, options, selections]);

  const handleChange = event => {
    const value = event?.target?.value;
    const checked = event?.target?.checked;

    if (!value || typeof value !== 'string') {
      return;
    }

    const next = new Set(selections);
    if (checked) {
      next.add(value);
    } else {
      next.delete(value);
    }

    onChange(Array.from(next));
  };

  const label =
    uiSchema?.['ui:title'] || schema?.title || 'Service-connected disabilities';
  const descriptionNode = uiSchema?.['ui:description'];
  const errorMessage = Array.isArray(errorSchema?.__errors)
    ? errorSchema.__errors[0]
    : undefined;
  const hasOptions = options.length > 0;
  const requiredValue =
    typeof required === 'function' ? required(formData) : required;
  const isRequired = hasOptions && !!requiredValue;

  if (!hasOptions) {
    return (
      <div id={idSchema?.$id} className="vads-u-margin-bottom--2">
        {label && (
          <p className="vads-u-font-weight--bold vads-u-margin-bottom--1">
            {label}
          </p>
        )}
        {descriptionNode}
        <p className="vads-u-margin-top--1">
          Add at least one service-connected disability before selecting it
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="vads-u-margin-bottom--2">
      {descriptionNode && (
        <div className="vads-u-margin-bottom--1">{descriptionNode}</div>
      )}
      <VaCheckboxGroup
        id={idSchema?.$id}
        name={idSchema?.$id}
        label={label}
        error={errorMessage}
        required={isRequired}
        onVaChange={handleChange}
        uswds
      >
        {options.map(option => (
          <VaCheckbox
            key={option}
            name={option}
            value={option}
            data-value={option}
            label={option}
            uswds
            checked={selections.includes(option)}
            disabled={disabled || readonly}
          />
        ))}
      </VaCheckboxGroup>
    </div>
  );
};

ConnectedDisabilitiesFieldDebug.propTypes = {
  disabled: PropTypes.bool,
  errorSchema: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.any,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  readonly: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
};

export default ConnectedDisabilitiesFieldDebug;
