import React, { useEffect } from 'react';
import { useField, FieldHookConfig, useFormikContext } from 'formik';

import { chainValidations, required } from '../utils/validation';
import { AddressProps, Address } from './types';
import { TextField, CheckboxField, SelectField } from './index';
import {
  Countries,
  CountryUSA,
  States,
  MilitaryCities,
  MilitaryStates,
} from '../utils/constants';

const AddressField = (props: AddressProps): JSX.Element => {
  const withValidation = {
    ...props,
    validate: chainValidations(props, [required]),
  };
  const [field] = useField(withValidation as FieldHookConfig<string>);
  const { setFieldValue } = useFormikContext();

  if (!field.value) {
    field.value = '';
  }
  const addressData = JSON.parse(JSON.stringify(field.value)) as Address;

  const initializeFormikState = () => {
    setFieldValue(`${field.name}.isMilitaryBaseOutside`, false);
    setFieldValue(`${field.name}.country`, Countries[0].value);
    // setFieldValue is async, so it pushes execution at the end
    setTimeout(() => {
      setFieldValue(`${field.name}.state`, States.USA[0].value);
    }, 0);
  };

  const isMilitaryBaseOutsideToggle = (addressData: Address) => {
    if (addressData.isMilitaryBaseOutside) {
      setFieldValue(`${field.name}.country`, Countries[0].value);
      setFieldValue(`${field.name}.city`, MilitaryCities[0].value);
      setFieldValue(`${field.name}.state`, MilitaryStates[0].value);
    } else {
      if (addressData.country !== CountryUSA[0].value) {
        setFieldValue(`${field.name}.state`, '');
      }
    }
  };

  const onCountryChange = () => {
    setFieldValue(`${field.name}.state`, undefined);

    if (addressData.country === CountryUSA[0].value) {
      setFieldValue(`${field.name}.state`, States.USA[0].value);
    }
  };

  // Initialize few values which id required to render UI
  useEffect(() => {
    initializeFormikState();
  }, []);

  // When 'isMilitaryBaseOutside' value is changed we are updating UI and setting some values
  useEffect(() => {
    isMilitaryBaseOutsideToggle(addressData);
  }, [addressData.isMilitaryBaseOutside]);

  // When 'country' value is changed we are updating UI and setting some values
  useEffect(() => {
    onCountryChange();
  }, [addressData.country]);

  return (
    <div id={`${field.name}`}>
      <CheckboxField
        id={`${field.name}IsMilitaryBaseOutside`}
        name={`${field.name}.isMilitaryBaseOutside`}
        checked={field.value ? true : false}
        label="I live on a United States military base outside of the country."
      />
      <SelectField
        id={`${field.name}Country`}
        name={`${field.name}.country`}
        value={field.value}
        label="Country"
        required
      >
        {addressData.isMilitaryBaseOutside
          ? CountryUSA.map((country) => {
              return (
                <option value={`${country.value}`} key={`${country.value}`}>
                  {country.label}
                </option>
              );
            })
          : Countries.map((country) => {
              return (
                <option value={`${country.value}`} key={`${country.value}`}>
                  {country.label}
                </option>
              );
            })}
      </SelectField>

      <p>
        U.S. military bases are considered a domestic address and a part of the
        United States.
      </p>

      <TextField
        id={`${field.name}StreetAddress`}
        name={`${field.name}.streetAddress`}
        value={field.value}
        label="Street address"
        required
      />
      <TextField
        id={`${field.name}StreetAddressLine2`}
        name={`${field.name}.streetAddressLine2`}
        value={field.value}
        label="Street address line 2"
      />
      <TextField
        id={`${field.name}StreetAddressLine3`}
        name={`${field.name}.streetAddressLine3`}
        value={field.value}
        label="Street address line 3"
      />
      {addressData.isMilitaryBaseOutside ? (
        <SelectField
          id={`${field.name}City`}
          name={`${field.name}.city`}
          value={field.value}
          onVaSelect={field.onChange}
          label="APO/FPO/DPO"
          required
        >
          {MilitaryCities.map((city) => (
            <option value={`${city.value}`} key={`${city.value}`}>
              {city.label}
            </option>
          ))}
        </SelectField>
      ) : (
        <TextField
          id={`${field.name}City`}
          name={`${field.name}.city`}
          value={field.value}
          label="City"
          required
        />
      )}
      {addressData.isMilitaryBaseOutside &&
      addressData.country === CountryUSA[0].value ? (
        <SelectField
          id={`${field.name}State`}
          name={`${field.name}.state`}
          label="State"
          value={field.value}
          required
        >
          {MilitaryStates.map((state) => (
            <option value={`${state.value}`} key={`${state.value}`}>
              {state.label}
            </option>
          ))}
        </SelectField>
      ) : (
        <>
          {!addressData.isMilitaryBaseOutside &&
          addressData.country === CountryUSA[0].value ? (
            <SelectField
              id={`${field.name}State`}
              name={`${field.name}.state`}
              value={field.value}
              label="State"
              required
            >
              {States.USA.map((state) => (
                <option value={`${state.value}`} key={`${state.value}`}>
                  {state.label}
                </option>
              ))}
            </SelectField>
          ) : (
            <TextField
              id={`${field.name}State`}
              name={`${field.name}.state`}
              value={field.value}
              label="State/Province/Region"
            />
          )}
        </>
      )}
      <TextField
        id={`${field.name}PostalCode`}
        name={`${field.name}.postalCode`}
        label="Postal code"
        value={field.value}
        onChange={field.onChange}
        required
      />
    </div>
  );
};

export default AddressField;
