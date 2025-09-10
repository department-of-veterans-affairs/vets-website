import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'platform/utilities/data';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
// import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { validateDate } from 'platform/forms-system/src/js/validation';
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
import { isCompletingModern4142 } from '../utils';

import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';

import { validateZIP } from '../validations';

const { form4142 } = fullSchema.properties;

const {
  providerFacilityName,
  providerFacilityAddress,
} = form4142.properties.providerFacility.items.properties;
const { limitedConsent } = form4142.properties;

const TreatedDisabilitiesCheckboxGroup = props => {
  const { id, value, onChange, errorSchema, required, formData } = props;

  // Get full form data from Redux
  const fullFormData = useSelector(state => state.form?.data || {});
  const hasInitializedRef = React.useRef(false);
  const pendingUpdateRef = React.useRef(null);

  // Track local state for immediate UI updates
  const [localValue, setLocalValue] = useState(() => {
    return formData || value || {};
  });

  // Update local state when props change
  useEffect(
    () => {
      const newValue = formData || value || {};
      if (JSON.stringify(newValue) !== JSON.stringify(localValue)) {
        setLocalValue(newValue);
      }
    },
    [formData, value],
  );

  // Extract disabilities from form data
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
      if (!hasInitializedRef.current && disabilityList.length > 0 && onChange) {
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
    [disabilityList.length],
  ); // Only when list size changes

  // Process pending updates
  useEffect(() => {
    if (pendingUpdateRef.current && onChange) {
      onChange(pendingUpdateRef.current);
      pendingUpdateRef.current = null;
    }
  });

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

    // Call onChange immediately and again after a microtask
    if (typeof onChange === 'function') {
      onChange(newValue);

      // Ensure the change propagates
      Promise.resolve().then(() => {
        onChange(newValue);
      });
    }
  };

  // Determine if there's an error to show
  const hasError = errorSchema?.__errors?.length > 0;
  const errorMessage = hasError ? errorSchema.__errors[0] : null;

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

  return (
    <fieldset className="vads-u-margin-y--2">
      <legend className="schemaform-label vads-u-font-weight--normal vads-u-font-size--base">
        What conditions were you treated for?
        {required && (
          <span className="schemaform-required-span vads-u-font-weight--normal">
            {' '}
            (*Required)
          </span>
        )}
      </legend>

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
          // Use localValue for immediate UI updates
          const isChecked = localValue[conditionName] === true;

          return (
            <VaCheckbox
              key={conditionName}
              id={checkboxId}
              name={checkboxId}
              label={conditionName}
              checked={isChecked}
              onVaChange={event => {
                handleCheckboxChange(conditionName, event.detail.checked);
              }}
              uswds
            />
          );
        })}
      </div>
    </fieldset>
  );
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
      providerFacilityName: {
        'ui:title': 'Name of private provider or hospital',
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
      },
      treatedDisabilityNames: {
        'ui:title': 'What conditions were you treated for?',
        // 'ui:webComponentField': VaCheckboxGroupField,
        // 'ui:field': TreatedDisabilityNamesField,
        // 'ui:field': ConnectedTreatedDisabilitiesCheckboxGroup,
        'ui:field': TreatedDisabilitiesCheckboxGroup,
        'ui:options': {
          // {
          // updateSchema: makeSchemaForAllDisabilities,
          itemAriaLabel: data => data.treatmentCenterName,
          showFieldLabel: true,
          hideIf: formData => !isCompletingModern4142(formData),
        },
        'ui:validations': [
          (errors, fieldData, formData, schema, errorMessages) => {
            // Custom validation that checks the actual field data
            const hasSelection =
              fieldData && Object.values(fieldData).some(v => v === true);
            if (!hasSelection) {
              errors.addError(
                errorMessages?.atLeastOne ||
                  'Please select at least one condition',
              );
            }
          },
        ],
        'ui:errorMessages': {
          atLeastOne: 'Please select at least one condition',
          required: 'Please select at least one condition',
        },
        'ui:required': formData => isCompletingModern4142(formData),
      },
      'ui:validations': [validateDate],
      treatmentDateRange: dateRangeUI(
        'When did your treatment start? (You can provide an estimated date)',
        'When did your treatment end? (You can provide an estimated date)',
        'End of treatment must be after start of treatment',
      ),
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
        country: {
          'ui:title': 'Country',
          'ui:autocomplete': 'off',
        },
        street: {
          'ui:title': 'Street',
          'ui:autocomplete': 'off',
        },
        street2: {
          'ui:title': 'Street 2',
          'ui:autocomplete': 'off',
        },
        city: {
          'ui:title': 'City',
          'ui:autocomplete': 'off',
        },
        state: {
          'ui:title': 'State',
          'ui:autocomplete': 'off',
        },
        postalCode: {
          'ui:title': 'Postal code',
          'ui:autocomplete': 'off',
          'ui:validations': [validateZIP],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid 5- or 9-digit Postal code (dashes allowed)',
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
