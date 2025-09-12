import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import _ from 'platform/utilities/data';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
// import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import {
  validateDate,
  validateBooleanGroup,
} from 'platform/forms-system/src/js/validation';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  recordReleaseDescription,
  limitedConsentTitle,
  limitedConsentTextTitle,
  limitedConsentDescription,
} from '../content/privateMedicalRecordsRelease';
import { isCompletingForm0781 } from '../utils/form0781';
import { standardTitle } from '../content/form0781';
// import { makeSchemaForAllDisabilities } from '../utils/schemas';
import { isCompletingModern4142, capitalizeEachWord } from '../utils';

import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';

import { validateZIP } from '../validations';

const { form4142 } = fullSchema.properties;

const {
  providerFacilityName,
  providerFacilityAddress,
} = form4142.properties.providerFacility.items.properties;
const { limitedConsent } = form4142.properties;

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

export const uiSchema = {
  'ui:title': standardTitle('Request medical records from private providers'),
  'ui:description': recordReleaseDescription,
  'view:limitedConsent': {
    'ui:webComponentField': VaCheckboxField,
    'ui:title': limitedConsentTitle,
  },
  limitedConsent: {
    'ui:title': limitedConsentTextTitle,
    'ui:options': {
      expandUnder: 'view:limitedConsent',
      expandUnderCondition: true,
    },
    'ui:required': formData => _.get('view:limitedConsent', formData, false),
  },
  'view:privateRecordsChoiceHelp': {
    'ui:description': limitedConsentDescription,
  },
  providerFacility: {
    'ui:options': {
      itemName: 'Provider or hospital',
      viewField: PrivateProviderTreatmentView,
      hideTitle: true,
      reviewMode: true,
    },
    items: {
      'ui:errorMessages': {
        required: 'Please complete all required fields for this provider',
      },
      providerFacilityName: {
        'ui:title': 'Name of private provider or hospital',
        'ui:errorMessages': {
          required: 'Please enter the name of the provider or hospital',
        },
      },
      treatmentLocation0781Related: {
        ...yesNoUI({
          title:
            'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
        }),
        'ui:options': {
          hideIf: formData => !isCompletingForm0781(formData),
        },
        'ui:required': formData => isCompletingForm0781(formData),
        'ui:errorMessages': {
          required:
            'Please indicate if you received treatment at this facility related to your traumatic events',
        },
      },
      treatedDisabilityNames: {
        'ui:title': 'What conditions were you treated for?',
        'ui:field': TreatedDisabilitiesCheckboxGroup,
        'ui:options': {
          // {
          // updateSchema: makeSchemaForAllDisabilities,
          itemAriaLabel: data => data.treatmentCenterName,
          showFieldLabel: true,
          hideIf: formData => !isCompletingModern4142(formData),
        },
        'ui:validations': [validateBooleanGroup],
        'ui:errorMessages': {
          atLeastOne: 'Please select at least one condition for this provider',
          required: 'Please select at least one condition',
        },
        'ui:required': formData => isCompletingModern4142(formData),
      },
      'ui:validations': [validateDate],
      treatmentDateRange: {
        ...dateRangeUI(
          'When did your treatment start? (You can provide an estimated date)',
          'When did your treatment end? (You can provide an estimated date)',
          'End of treatment must be after start of treatment',
        ),
        'ui:errorMessages': {
          required: 'Please provide treatment dates',
        },
      },
      providerFacilityAddress: {
        'ui:title': 'Address of provider or hospital',
        'ui:order': [
          'country',
          'street',
          'street2',
          'city',
          'state',
          'postalCode',
        ],
        'ui:errorMessages': {
          required: 'Please enter the address',
        },
        country: {
          'ui:title': 'Country',
          'ui:autocomplete': 'off',
          'ui:errorMessages': {
            required: 'Please select a country',
          },
        },
        street: {
          'ui:title': 'Street',
          'ui:autocomplete': 'off',
          'ui:errorMessages': {
            required: 'Please enter a street address',
          },
        },
        street2: {
          'ui:title': 'Street 2',
          'ui:autocomplete': 'off',
        },
        city: {
          'ui:title': 'City',
          'ui:autocomplete': 'off',
          'ui:errorMessages': {
            required: 'Please enter a city',
          },
        },
        state: {
          'ui:title': 'State',
          'ui:autocomplete': 'off',
          'ui:errorMessages': {
            required: 'Please select a state',
          },
        },
        postalCode: {
          'ui:title': 'Postal code',
          'ui:autocomplete': 'off',
          'ui:validations': [validateZIP],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid 5- or 9-digit Postal code (dashes allowed)',
            required: 'Please enter a postal code',
          },
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    providerFacility: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: [
          'providerFacilityName',
          'treatmentDateRange',
          'providerFacilityAddress',
          'treatmentLocation0781Related',
          'treatedDisabilityNames',
        ],
        properties: {
          providerFacilityName,
          treatmentLocation0781Related: {
            type: 'boolean',
            properties: {},
          },
          treatedDisabilityNames: {
            type: 'object',
            properties: {},
          },
          treatmentDateRange: {
            type: 'object',
            $ref: '#/definitions/dateRangeAllRequired',
          },
          providerFacilityAddress,
        },
      },
    },
    'view:limitedConsent': {
      type: 'boolean',
    },
    limitedConsent,
    'view:privateRecordsChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};
