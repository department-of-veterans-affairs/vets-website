import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import { POSTAL_PATTERNS } from '../../../schemas/regex-patterns';

/**
 * Comprehensive address field component using VA web components directly.
 * Implements the official VA address pattern with military base support,
 * country-specific validation, and USPS verification readiness.
 * This is the primary address component for all VA form applications.
 *
 * @component
 * @see [VA Address Pattern](https://design.va.gov/patterns/ask-users-for/addresses)
 * @see [Web Components Catalog - Address Integration](../docs/WEB_COMPONENTS_CATALOG.md#components-used-in-form-21-2008)
 * @see [Address Implementation Guide](../docs/ADDRESS_IMPLEMENTATION.md)
 * @example [Address Example](https://staging.va.gov/mock-form-patterns/mailing-address)
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Field label (e.g., "Mailing address", "Home address")
 * @param {string} [props.description] - Optional description text shown below label
 * @param {Object} props.value - Current address value object
 * @param {string} [props.value.street] - Street address line 1
 * @param {string} [props.value.street2] - Street address line 2
 * @param {string} [props.value.street3] - Street address line 3
 * @param {string} [props.value.city] - City or military post office
 * @param {string} [props.value.state] - State/province code
 * @param {string} [props.value.province] - International province/region
 * @param {string} [props.value.country] - Country code
 * @param {string} [props.value.postalCode] - ZIP/postal code
 * @param {string} [props.value.internationalPostalCode] - International postal code
 * @param {boolean} [props.value.isMilitary] - Military base indicator
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.allowMilitary=true] - Enable military base address option
 * @param {boolean} [props.omitStreet3=false] - Omit street line 3 if backend doesn't support
 * @param {Function} [props.onUSPSVerify] - Callback for USPS verification
 * @param {Function} [props.onValidate] - Validation callback (isValid, errors) => void
 * @returns {JSX.Element} VA address field with military and international support
 *
 * @example
 * ```jsx
 * <AddressField
 *   name="mailingAddress"
 *   label="Mailing address"
 *   value={formData.mailingAddress}
 *   onChange={handleAddressChange}
 *   allowMilitary={true}
 *   onUSPSVerify={handleUSPSVerification}
 *   onValidate={(isValid, errors) => {
 *     setAddressValid(isValid);
 *   }}
 * />
 * ```
 */
export const AddressField = ({
  name,
  label = 'Mailing address',
  description = "We'll send any important information about your application to this address.",
  value: initialValue = {},
  onChange,
  errors: externalErrors = {},
  touched: externalTouched = {},
  onBlur,
  allowMilitary = true,
  omitStreet3 = false,
  onUSPSVerify,
  onValidate,
}) => {
  // Ensure all value properties have defaults to prevent undefined errors
  const value = {
    street: '',
    street2: '',
    street3: '',
    city: '',
    state: '',
    province: '',
    country: 'USA',
    postalCode: '',
    internationalPostalCode: '',
    isMilitary: false,
    ...initialValue,
  };

  const [internalErrors, setInternalErrors] = useState({});
  const [internalTouched, setInternalTouched] = useState({});
  const errors =
    Object.keys(externalErrors).length > 0 ? externalErrors : internalErrors;
  const touched =
    Object.keys(externalTouched).length > 0 ? externalTouched : internalTouched;
  const [savedCityState, setSavedCityState] = useState({ city: '', state: '' });

  const MILITARY_CITIES = [
    { value: 'APO', label: 'APO (Air or Army post office)' },
    { value: 'FPO', label: 'FPO (Fleet post office)' },
    { value: 'DPO', label: 'DPO (Diplomatic post office)' },
  ];

  const MILITARY_STATES = [
    {
      value: 'AA',
      label:
        'AA (Armed Forces America) - North and South America, excluding Canada',
    },
    {
      value: 'AE',
      label:
        'AE (Armed Forces Europe) - Africa, Canada, Europe, and the Middle East',
    },
    {
      value: 'AP',
      label: 'AP (Armed Forces Pacific) - Pacific',
    },
  ];

  const getStateOptions = country => {
    if (value.isMilitary) {
      return MILITARY_STATES;
    }

    switch (country) {
      case 'USA':
        return constants.states.USA.filter(
          state => !['AA', 'AE', 'AP'].includes(state.value),
        );
      case 'CAN':
        return constants.states.CAN;
      case 'MEX':
        return constants.states.MEX;
      default:
        return [];
    }
  };

  const getStateLabel = useCallback(
    country => {
      if (value.isMilitary) {
        return 'Overseas "state" abbreviation';
      }

      switch (country) {
        case 'USA':
          return 'State';
        case 'CAN':
          return 'Province or territory';
        case 'MEX':
          return 'State';
        default:
          return 'State, province, or region';
      }
    },
    [value.isMilitary],
  );

  const getPostalCodeLabel = useCallback(
    country => {
      if (country === 'USA' || value.isMilitary) {
        return 'ZIP code';
      }
      return 'Postal code';
    },
    [value.isMilitary],
  );

  const handleFieldChange = useCallback(
    (fieldName, fieldValue) => {
      const updatedAddress = { ...value, [fieldName]: fieldValue };

      if (fieldName === 'isMilitary') {
        if (fieldValue) {
          setSavedCityState({
            city: value.city || '',
            state: value.state || '',
          });
          updatedAddress.country = 'USA';
          updatedAddress.city = '';
          updatedAddress.state = '';
        } else {
          if (value.city && ['APO', 'FPO', 'DPO'].includes(value.city)) {
            updatedAddress.city = savedCityState.city;
          }
          if (value.state && ['AA', 'AE', 'AP'].includes(value.state)) {
            updatedAddress.state = savedCityState.state;
          }
        }
      }

      if (fieldName === 'country' && !value.isMilitary) {
        updatedAddress.state = '';
        updatedAddress.province = '';
      }

      onChange(name, updatedAddress);
      if (!onBlur) {
        setInternalTouched(prev => ({ ...prev, [fieldName]: true }));
      }
    },
    [name, value, onChange, savedCityState, onBlur],
  );

  const handleBlur = useCallback(
    fieldName => {
      if (onBlur) {
        onBlur(fieldName);
      } else {
        setInternalTouched(prev => ({ ...prev, [fieldName]: true }));
      }
    },
    [onBlur],
  );

  const validateField = useCallback(
    (fieldName, fieldValue) => {
      let error = null;

      if (!fieldValue && fieldName !== 'street2' && fieldName !== 'street3') {
        const labelMap = {
          country: 'Country',
          street: 'Street address',
          city: value.isMilitary ? 'Military post office' : 'City',
          state: getStateLabel(value.country),
          province: 'State, province, or region',
          postalCode: getPostalCodeLabel(value.country),
          internationalPostalCode: 'Postal code',
        };
        error = `${labelMap[fieldName] || fieldName} is required`;
      }

      if (fieldName === 'postalCode' && fieldValue) {
        if (value.country === 'USA' || value.isMilitary) {
          if (!POSTAL_PATTERNS.USA.test(fieldValue)) {
            error = 'Please enter a valid ZIP code (5 or 9 digits)';
          }
        } else if (value.country === 'CAN') {
          if (!POSTAL_PATTERNS.CANADA.test(fieldValue)) {
            error = 'Please enter a valid Canadian postal code (e.g., K1A 0B1)';
          }
        } else if (
          value.country === 'MEX' &&
          !POSTAL_PATTERNS.MEXICO.test(fieldValue)
        ) {
          error = 'Please enter a valid 5-digit postal code';
        }
      }

      if (fieldName === 'internationalPostalCode' && fieldValue === 'NA') {
        error = null;
      }

      return error;
    },
    [value.country, value.isMilitary, getPostalCodeLabel, getStateLabel],
  );

  useEffect(
    () => {
      if (Object.keys(externalErrors).length > 0) {
        return;
      }

      const touchedFields = Object.keys(touched).filter(
        field => touched[field],
      );
      if (touchedFields.length > 0) {
        const fieldErrors = {};
        let hasErrors = false;

        touchedFields.forEach(field => {
          const error = validateField(field, value[field]);
          if (error) {
            fieldErrors[field] = error;
            hasErrors = true;
          }
        });

        // Only update if errors actually changed
        setInternalErrors(prevErrors => {
          const errorKeys = Object.keys(fieldErrors)
            .sort()
            .join(',');
          const prevErrorKeys = Object.keys(prevErrors)
            .sort()
            .join(',');
          if (errorKeys !== prevErrorKeys) {
            return fieldErrors;
          }
          return prevErrors;
        });

        onValidate?.(!hasErrors, fieldErrors);
      }
    },
    // Remove touched from dependencies to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      value.street,
      value.city,
      value.state,
      value.postalCode,
      value.country,
      value.isMilitary,
      validateField,
      onValidate,
      externalErrors,
    ],
  );

  const showStateDropdown = useMemo(
    () =>
      value.isMilitary ||
      (value.country && ['USA', 'CAN', 'MEX'].includes(value.country)),
    [value.country, value.isMilitary],
  );

  const isInternational = useMemo(
    () =>
      value.country &&
      !['USA', 'CAN', 'MEX'].includes(value.country) &&
      !value.isMilitary,
    [value.country, value.isMilitary],
  );

  const requiresUSPSVerification = useCallback(address => {
    return (
      address.country === 'USA' &&
      !address.isMilitary &&
      address.street &&
      address.city &&
      address.state &&
      address.postalCode
    );
  }, []);

  const getPostalCodeHint = () => {
    if (isInternational) {
      return "Enter 'NA' if your country doesn't use postal codes";
    }
    if (value.country === 'CAN') {
      return 'Example: K1A 0B1';
    }
    if (value.country === 'USA' || value.isMilitary) {
      return '5 or 9 digits';
    }
    return null;
  };

  const renderStateField = () => {
    if (!showStateDropdown) {
      return (
        <va-text-input
          label={getStateLabel(value.country)}
          name={`${name}.province`}
          value={value.province || ''}
          error={touched.province ? errors.province : null}
          required
          autocomplete="address-level1"
          onInput={e => handleFieldChange('province', e.target.value)}
          onBlur={() => handleBlur('province')}
        />
      );
    }

    if (value.isMilitary) {
      return (
        <va-radio
          label={getStateLabel(value.country)}
          name={`${name}.state`}
          value={value.state || ''}
          error={touched.state ? errors.state : null}
          required
          onVaValueChange={e => handleFieldChange('state', e.detail.value)}
          onBlur={() => handleBlur('state')}
        >
          {MILITARY_STATES.map(state => (
            <va-radio-option
              key={state.value}
              label={state.label}
              value={state.value}
            />
          ))}
        </va-radio>
      );
    }

    return (
      <VaSelect
        label={getStateLabel(value.country)}
        name={`${name}.state`}
        value={value.state || ''}
        error={touched.state ? errors.state : null}
        required={
          value.country && ['USA', 'CAN', 'MEX'].includes(value.country)
        }
        onVaSelect={e => handleFieldChange('state', e.detail.value)}
        onBlur={() => handleBlur('state')}
      >
        <option value="">- Select -</option>
        {getStateOptions(value.country).map(state => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </VaSelect>
    );
  };

  useEffect(
    () => {
      if (onUSPSVerify && requiresUSPSVerification(value)) {
        const allFieldsTouched = [
          'street',
          'city',
          'state',
          'postalCode',
        ].every(field => touched[field]);
        if (allFieldsTouched && Object.keys(errors).length === 0) {
          onUSPSVerify(value);
        }
      }
    },
    [value, touched, errors, onUSPSVerify, requiresUSPSVerification],
  );

  return (
    <fieldset className="vads-u-margin-y--2">
      <legend className="schemaform-block-title">
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
          {label}
        </h3>
        {description && (
          <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
            {description}
          </span>
        )}
      </legend>

      {allowMilitary && (
        <>
          <va-checkbox
            label="I live on a U.S. military base outside of the United States"
            checked={value.isMilitary || false}
            onVaChange={e => handleFieldChange('isMilitary', e.detail.checked)}
          />

          <div className="vads-u-padding-x--2p5">
            <va-additional-info trigger="Learn more about military base addresses">
              <span>
                The United States is automatically chosen as your country if you
                live on a military base outside of the country.
              </span>
            </va-additional-info>
          </div>
        </>
      )}

      <va-select
        label="Country"
        name={`${name}.country`}
        value={value.country || ''}
        error={touched.country ? errors.country : null}
        required
        onVaSelect={e => handleFieldChange('country', e.detail.value)}
        onBlur={() => handleBlur('country')}
        disabled={value.isMilitary}
      >
        <option value="">- Select -</option>
        {constants.countries.map(country => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </va-select>

      <va-text-input
        label="Street address"
        name={`${name}.street`}
        value={value.street || ''}
        error={touched.street ? errors.street : null}
        required
        autocomplete="address-line1"
        onInput={e => handleFieldChange('street', e.target.value)}
        onBlur={() => handleBlur('street')}
      />

      <va-text-input
        label={
          value.isMilitary
            ? 'Apartment or unit number'
            : 'Street address line 2'
        }
        name={`${name}.street2`}
        value={value.street2 || ''}
        error={touched.street2 ? errors.street2 : null}
        autocomplete="address-line2"
        onInput={e => handleFieldChange('street2', e.target.value)}
        onBlur={() => handleBlur('street2')}
      />

      {!omitStreet3 && (
        <va-text-input
          label={
            value.isMilitary
              ? 'Additional address information'
              : 'Street address line 3'
          }
          name={`${name}.street3`}
          value={value.street3 || ''}
          error={touched.street3 ? errors.street3 : null}
          autocomplete="address-line3"
          onInput={e => handleFieldChange('street3', e.target.value)}
          onBlur={() => handleBlur('street3')}
        />
      )}

      {value.isMilitary ? (
        <va-radio
          label="Military post office"
          name={`${name}.city`}
          value={value.city || ''}
          error={touched.city ? errors.city : null}
          required
          onVaValueChange={e => handleFieldChange('city', e.detail.value)}
          onBlur={() => handleBlur('city')}
        >
          {MILITARY_CITIES.map(city => (
            <va-radio-option
              key={city.value}
              label={city.label}
              value={city.value}
            />
          ))}
        </va-radio>
      ) : (
        <va-text-input
          label="City"
          name={`${name}.city`}
          value={value.city || ''}
          error={touched.city ? errors.city : null}
          required
          autocomplete="address-level2"
          onInput={e => handleFieldChange('city', e.target.value)}
          onBlur={() => handleBlur('city')}
        />
      )}

      {renderStateField()}

      <va-text-input
        label={getPostalCodeLabel(value.country)}
        name={
          isInternational
            ? `${name}.internationalPostalCode`
            : `${name}.postalCode`
        }
        value={
          isInternational
            ? value.internationalPostalCode || ''
            : value.postalCode || ''
        }
        error={
          touched[isInternational ? 'internationalPostalCode' : 'postalCode']
            ? errors[isInternational ? 'internationalPostalCode' : 'postalCode']
            : null
        }
        required
        hint={getPostalCodeHint()}
        autocomplete="postal-code"
        onInput={e =>
          handleFieldChange(
            isInternational ? 'internationalPostalCode' : 'postalCode',
            e.target.value,
          )
        }
        onBlur={() =>
          handleBlur(isInternational ? 'internationalPostalCode' : 'postalCode')
        }
      />
    </fieldset>
  );
};

AddressField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  allowMilitary: PropTypes.bool,
  description: PropTypes.string,
  errors: PropTypes.object,
  label: PropTypes.string,
  omitStreet3: PropTypes.bool,
  touched: PropTypes.object,
  value: PropTypes.shape({
    city: PropTypes.string,
    country: PropTypes.string,
    internationalPostalCode: PropTypes.string,
    isMilitary: PropTypes.bool,
    postalCode: PropTypes.string,
    province: PropTypes.string,
    state: PropTypes.string,
    street: PropTypes.string,
    street2: PropTypes.string,
    street3: PropTypes.string,
  }),
  onBlur: PropTypes.func,
  onUSPSVerify: PropTypes.func,
  onValidate: PropTypes.func,
};
