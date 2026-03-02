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
    .map(
      entry =>
        entry && typeof entry === 'object' ? entry.disability : undefined,
    )
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

const extractErrorMessage = schemaNode => {
  if (!schemaNode) {
    return undefined;
  }

  if (Array.isArray(schemaNode)) {
    for (const entry of schemaNode) {
      const nestedMessage = extractErrorMessage(entry);
      if (nestedMessage) {
        return nestedMessage;
      }
    }
    return undefined;
  }

  if (typeof schemaNode !== 'object') {
    return undefined;
  }

  if (Array.isArray(schemaNode.__errors) && schemaNode.__errors.length) {
    return schemaNode.__errors[0];
  }

  for (const key of Object.keys(schemaNode)) {
    if (key !== '__errors') {
      const nestedMessage = extractErrorMessage(schemaNode[key]);
      if (nestedMessage) {
        return nestedMessage;
      }
    }
  }

  return undefined;
};

const ConnectedDisabilitiesFieldDebug = props => {
  const {
    formData,
    schema,
    uiSchema,
    idSchema,
    errorSchema,
    rawErrors,
    error,
    required,
    disabled,
    readonly,
    onChange,
    formContext,
  } = props;

  // Get the full form data from Redux store
  const fullFormData = useSelector(state => state?.form?.data || {});

  const options = useMemo(
    () => {
      // Extract disabilities from the full form data
      const disabilitiesFromFullData = extractDisabilityLabels(fullFormData);

      return disabilitiesFromFullData.length > 0
        ? disabilitiesFromFullData
        : [];
    },
    [fullFormData],
  );

  const selections = useMemo(
    () => {
      return Array.isArray(formData)
        ? formData.filter(item => typeof item === 'string')
        : [];
    },
    [formData],
  );

  useEffect(
    () => {
      const coerced = coerceSelections(formData, options);
      const needsNormalization =
        !Array.isArray(formData) || !arraysEqual(coerced, selections);
      if (needsNormalization) {
        onChange(coerced);
      }
    },
    [formData, onChange, options, selections],
  );

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
  let errorMessage = error;
  if (!errorMessage && Array.isArray(rawErrors) && rawErrors.length) {
    [errorMessage] = rawErrors;
  }
  if (!errorMessage) {
    errorMessage = extractErrorMessage(errorSchema);
  }

  const hasOptions = options.length > 0;
  const requiredValue =
    typeof required === 'function' ? required(formData) : required;
  const isRequired = hasOptions && !!requiredValue;

  if (!errorMessage) {
    const requiredErrorMessage =
      uiSchema?.['ui:errorMessages']?.minItems ||
      uiSchema?.['ui:errorMessages']?.required ||
      'Select at least one option';
    const wasSubmitted = Boolean(
      formContext?.submitted || formContext?.onReviewPage,
    );
    const shouldShowManualError =
      wasSubmitted && isRequired && selections.length === 0;

    if (shouldShowManualError) {
      errorMessage = requiredErrorMessage;
    }
  }

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
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  errorSchema: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.any,
  idSchema: PropTypes.object,
  rawErrors: PropTypes.array,
  readonly: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
};

export default ConnectedDisabilitiesFieldDebug;
