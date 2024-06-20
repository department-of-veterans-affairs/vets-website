/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */ // keys are defined, error being thrown in eslint even when key is defined
import React from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import { BAD_UNIT_NUMBER, MISSING_UNIT_NUMBER } from './constants';

export const scrollToElement = el => {
  const element = document.getElementById(el);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// make an object of just the military state codes and names
export const MILITARY_STATES = Object.entries(ADDRESS_DATA.states).reduce(
  (militaryStates, [stateCode, stateName]) => {
    if (ADDRESS_DATA.militaryStates.includes(stateCode)) {
      return {
        ...militaryStates,
        [stateCode]: stateName,
      };
    }
    return militaryStates;
  },
  {},
);

export const objectHasNoUndefinedValues = obj => {
  return Object.values(obj).every(value => value !== undefined);
};
export const noSuggestedAddress = deliveryPointValidation => {
  return (
    deliveryPointValidation === BAD_UNIT_NUMBER ||
    deliveryPointValidation === MISSING_UNIT_NUMBER ||
    deliveryPointValidation === 'MISSING_ZIP'
  );
};
export const formatAddress = address => {
  const city = address?.city ?? '';
  const stateCode = address?.stateCode ?? '';
  const zipCode = address?.zipCode ?? '';

  return `${city}${
    stateCode || zipCode ? ',' : ''
  } ${stateCode} ${zipCode}`.trim();
};
export const prepareAddressData = formData => {
  let addressData = {
    veteranName: formData.fullName,
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    addressLine3: formData.addressLine3,
    addressLine4: formData.addressLine4,
    addressPou: 'CORRESPONDENCE',
    countryCodeIso3: formData.countryCodeIso3,
    city: formData.city,
  };
  if (formData.countryCodeIso3 === 'USA') {
    const baseUSAData = {
      stateCode: formData.stateCode,
      zipCode: formData.zipCode,
      addressType: 'DOMESTIC',
    };
    if (formData['view:livesOnMilitaryBase']) {
      baseUSAData.addressType = 'OVERSEAS MILITARY';
    }
    addressData = { ...addressData, ...baseUSAData };
  } else {
    const internationalData = {
      province: formData.province,
      internationalPostalCode: formData.internationalPostalCode,
      addressType: 'INTERNATIONAL',
    };
    addressData = { ...addressData, ...internationalData };
  }
  return addressData;
};

export const addressLabel = address => {
  // Destructure address object for easier access
  const {
    addressLine1,
    addressLine2,
    city,
    province,
    stateCode,
    internationalPostalCode,
    zipCode,
  } = address;

  const line1 = addressLine1 || '';
  const line2 = addressLine2 || '';

  const cityState = city && (province || stateCode) ? `${city}, ` : city;

  const state = province || stateCode || '';

  const postalCode = internationalPostalCode || zipCode || '';

  return (
    <span>
      {line1 && <>{line1} </>}
      {line2 && <>{` ${line2}`}</>}
      {cityState && (
        <>
          <br /> {cityState}
        </>
      )}
      {state && <>{state}</>}
      {postalCode && (state || cityState) && ' '}
      {postalCode}
    </span>
  );
};

export const hasFormChanged = obj => {
  const keys = Object.keys(obj ?? {});
  for (const key of keys) {
    const value = obj[key];
    // Skip the specific key
    if (key === 'view:livesOnMilitaryBaseInfo') {
      // eslint-disable-next-line no-continue
      continue;
    }
    // Checking if there is value that is not undefined
    if (value !== undefined) {
      return true;
    }
  }
  return false;
};

export function compareAddressObjects(obj1, obj2) {
  const { hasOwnProperty } = Object.prototype;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length === 0 && keys2.length === 0) {
    return false;
  }
  for (const key of keys1) {
    if (key === 'view:livesOnMilitaryBaseInfo') {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (
      hasOwnProperty.call(obj1, key) &&
      hasOwnProperty.call(obj2, key) &&
      obj1[key] !== obj2[key]
    ) {
      return true;
    }
  }

  for (const key of keys2) {
    if (key === 'view:livesOnMilitaryBaseInfo') {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (
      hasOwnProperty.call(obj2, key) &&
      hasOwnProperty.call(obj1, key) &&
      obj2[key] !== obj1[key]
    ) {
      return true;
    }
  }

  return false;
}

// Utility function to deep compare two objects
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (
      key === 'view:livesOnMilitaryBaseInfo' ||
      key === 'view:livesOnMilitaryBase'
    ) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

const initialState = {
  addressLine1: undefined,
  addressLine2: undefined,
  addressLine3: undefined,
  addressLine4: undefined,
  city: undefined,
  countryCodeIso3: 'USA',
  internationalPostalCode: undefined,
  province: undefined,
  stateCode: '- Select -',
  'view:livesOnMilitaryBase': undefined,
  'view:livesOnMilitaryBaseInfo': {},
  zipCode: undefined,
};

// Function to check if the object has changed
export function hasAddressFormChanged(currentState) {
  const filledCurrentState = {
    ...initialState,
    ...currentState,
    stateCode:
      currentState.stateCode !== undefined
        ? currentState.stateCode
        : initialState.stateCode,
  };
  return !deepEqual(initialState, filledCurrentState);
}
