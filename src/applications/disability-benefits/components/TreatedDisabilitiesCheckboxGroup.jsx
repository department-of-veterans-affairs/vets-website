import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { capitalizeEachWord } from '../all-claims/utils';

const TreatedDisabilitiesCheckboxGroup = props => {
  const {
    id,
    value,
    onChange,
    errorSchema,
    formData,
    formContext,
    disabled,
    readonly,
  } = props;

  // Get full form data from Redux
  const fullFormData = useSelector(state => state.form?.data || {});
  const hasInitializedRef = React.useRef(false);
  const pendingUpdateRef = React.useRef(null);

  // Check if we're in review/read-only mode
  const hasError = errorSchema?.__errors?.length > 0;
  const errorMessage = hasError ? errorSchema.__errors[0] : null;
  const isReadOnly =
    disabled || readonly || formContext?.reviewMode || formContext?.submitted;

  // Track local state for immediate UI updates
  const [localValue, setLocalValue] = useState(() => {
    return formData || value || {};
  });

  // Update local state when props change
  useEffect(
    () => {
      const newValue = formData || value || {};
      // Only update if we have actual data and it's different
      if (
        Object.keys(newValue).length > 0 &&
        JSON.stringify(newValue) !== JSON.stringify(localValue)
      ) {
        setLocalValue(newValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData, value], // Only re-run when props change, not when localValue changes
  );

  // Extract disabilities from form data - TODO see if we can reformat response from makeSchemaForAllDisabilities to work here
  const disabilityList = useMemo(
    () => {
      if (!fullFormData) {
        return [];
      }

      const conditions = new Set();

      // Extract from new disabilities
      if (Array.isArray(fullFormData.newDisabilities)) {
        fullFormData.newDisabilities.forEach(item => {
          if (item?.condition && typeof item.condition === 'string') {
            conditions.add(item.condition.trim());
          }
        });
      }

      // Extract from rated disabilities
      if (Array.isArray(fullFormData.ratedDisabilities)) {
        fullFormData.ratedDisabilities.forEach(item => {
          if (item?.name && typeof item.name === 'string') {
            conditions.add(item.name.trim());
          }
        });
      }

      return Array.from(conditions).sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' }),
      );
    },
    [fullFormData],
  );

  // Initialize values only once when list changes
  useEffect(
    () => {
      if (
        !hasInitializedRef.current &&
        disabilityList.length > 0 &&
        onChange &&
        !isReadOnly
      ) {
        const needsInit = disabilityList.some(
          name => localValue[name] === undefined,
        );

        if (needsInit) {
          const initialized = {};
          disabilityList.forEach(name => {
            initialized[name] = localValue[name] === true;
          });
          setLocalValue(initialized);
          onChange(initialized);
          hasInitializedRef.current = true;
        }
      }
    },
    [disabilityList, disabilityList.length, isReadOnly, localValue, onChange],
  );

  // Process pending updates
  useEffect(() => {
    if (pendingUpdateRef.current && onChange && !isReadOnly) {
      try {
        onChange(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      } catch (error) {
        pendingUpdateRef.current = null;
      }
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      hasInitializedRef.current = false;
      pendingUpdateRef.current = null;
    };
  }, []);

  const handleCheckboxChange = (conditionName, isChecked) => {
    // Create a completely new object with all conditions
    const newValue = {};
    disabilityList.forEach(name => {
      if (name === conditionName) {
        newValue[name] = isChecked;
      } else {
        newValue[name] = localValue[name] === true;
      }
    });

    // Update local state for immediate UI update
    setLocalValue(newValue);

    // Store pending update
    pendingUpdateRef.current = newValue;

    // Call onChange immediately and again after a change
    if (typeof onChange === 'function') {
      onChange(newValue);

      // Ensure the change propagates
      Promise.resolve().then(() => {
        if (typeof onChange === 'function') {
          onChange(newValue);
        }
      });
    }
  };

  if (disabilityList.length === 0) {
    return (
      <div className="vads-u-margin-y--2">
        <va-alert status="info" slim>
          <p className="vads-u-margin--0">
            No conditions available. Please add conditions in previous sections
            first.
          </p>
        </va-alert>
      </div>
    );
  }

  // If in read-only mode with no conditions selected, show the checkboxes; otherwise, show a list of selected conditions
  if (isReadOnly) {
    // Use the most recent value from props when in read-only mode
    // Check if formData/value have actual checkbox values, not just empty objects
    const hasFormDataKeys = formData && Object.keys(formData).length > 0;
    const hasFormDataValues = value && Object.keys(value).length > 0;
    // TODO review this
    let readOnlyValue = {};
    if (hasFormDataKeys) {
      readOnlyValue = formData;
    } else if (hasFormDataValues) {
      readOnlyValue = value;
    } else {
      readOnlyValue = localValue || {};
    }
    const checkedConditions = disabilityList.filter(
      name => readOnlyValue[name] === true,
    );

    if (checkedConditions.length === 0) {
      // The form system handles the error display
      return (
        <>
          <div className="vads-u-margin-top--2" role="group">
            {disabilityList.map((conditionName, index) => {
              const checkboxId = `${id}_${index}`;
              const isChecked = localValue[conditionName] === true;

              return (
                <VaCheckbox
                  key={conditionName}
                  id={checkboxId}
                  name={checkboxId}
                  label={capitalizeEachWord(conditionName)}
                  checked={isChecked}
                  disabled={false}
                  onVaChange={event => {
                    handleCheckboxChange(conditionName, event.detail.checked);
                  }}
                  uswds
                />
              );
            })}
          </div>
        </>
      );
    }

    return (
      <div className="vads-u-margin-y--2">
        <dt>What conditions were you treated for?</dt>
        <dd>
          {checkedConditions.length === 0 ? (
            <span className="vads-u-color--secondary-dark">None selected</span>
          ) : (
            <ul className="vads-u-margin-top--0">
              {checkedConditions.map(condition => (
                <li key={condition}>{capitalizeEachWord(condition)}</li>
              ))}
            </ul>
          )}
        </dd>
      </div>
    );
  }
  // Editable mode - show checkboxes (either for normal editing or error fixing). Also has no fieldset/legend since form system handles the label
  return (
    <>
      {hasError &&
        errorMessage && (
          <span
            role="alert"
            className="usa-input-error-message vads-u-margin-top--1 vads-u-display--block"
          >
            <span className="sr-only">Error</span>
            {errorMessage}
          </span>
        )}

      <div className="vads-u-margin-top--2" role="group">
        {disabilityList.map((conditionName, index) => {
          const checkboxId = `${id}_${index}`;
          const isChecked = localValue[conditionName] === true;

          return (
            <VaCheckbox
              key={conditionName}
              id={checkboxId}
              name={checkboxId}
              label={capitalizeEachWord(conditionName)}
              checked={isChecked}
              disabled={false}
              onVaChange={event => {
                handleCheckboxChange(conditionName, event.detail.checked);
              }}
              uswds
            />
          );
        })}
      </div>
    </>
  );
};

TreatedDisabilitiesCheckboxGroup.propTypes = {
  disabled: PropTypes.bool,
  errorSchema: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  id: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  uiSchema: PropTypes.object,
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export default TreatedDisabilitiesCheckboxGroup;
