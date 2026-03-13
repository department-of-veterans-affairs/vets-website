import React from 'react';
import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { countries } from 'platform/forms/address';

/**
 * Converts a form address object to the snake_case format
 * required by the /v0/profile/address_validation endpoint
 * avoiding eslint issues.
 *
 * @param {Object} address - Form address object
 * @returns {Object} API-formatted address
 */
const ADDRESS_LINE1 = 'address_line1';
const ADDRESS_LINE2 = 'address_line2';
const ADDRESS_POU = 'address_pou';
const ADDRESS_TYPE = 'address_type';
const COUNTRY_CODE_ISO3 = 'country_code_iso3';
const STATE_CODE = 'state_code';
const ZIP_CODE = 'zip_code';

export const prepareAddressForAPI = address => ({
  [ADDRESS_LINE1]: address.street,
  [ADDRESS_LINE2]: address.street2 || undefined,
  [ADDRESS_POU]: 'CORRESPONDENCE',
  [ADDRESS_TYPE]: address.country === 'USA' ? 'DOMESTIC' : 'INTERNATIONAL',
  city: address.city,
  [COUNTRY_CODE_ISO3]: address.country || 'USA',
  [STATE_CODE]: address.state,
  [ZIP_CODE]: address.postalCode,
});

/**
 * Calls the address validation endpoint and returns the
 * suggested address along with a flag indicating whether
 * suggestions should be shown to the user.
 *
 * @param {Object} userAddress - Form address object
 * @returns {Promise<{suggestedAddress: Object|null, showSuggestions: boolean}>}
 */
export const fetchSuggestedAddress = async userAddress => {
  const options = {
    body: JSON.stringify({
      address: { ...prepareAddressForAPI(userAddress) },
    }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const res = await apiRequest(
      `${environment.API_URL}/v0/profile/address_validation`,
      options,
    );

    if (res?.addresses?.length > 0) {
      const suggested = res.addresses[0]?.address;
      const { confidenceScore } = res.addresses[0]?.addressMetaData || {};

      return {
        suggestedAddress: {
          street: suggested.addressLine1,
          street2: suggested.addressLine2,
          city: suggested.city,
          country: suggested.countryCodeIso3,
          state: suggested.stateCode,
          postalCode: suggested.zipCode,
        },
        confidenceScore,
        showSuggestions: confidenceScore !== 100,
        deliveryPointValidation:
          res.addresses[0]?.addressMetaData?.deliveryPointValidation,
      };
    }
  } catch {
    // If validation API fails, allow the user to proceed with their address
    return { suggestedAddress: null, showSuggestions: false };
  }

  return { suggestedAddress: null, showSuggestions: false };
};

/**
 * Formats an address object into a single display string.
 *
 * @param {Object} address - Address object (supports both form and API field names)
 * @returns {string} Formatted address string
 */
export const formatAddress = address => {
  if (!address) return '';

  const street = address.street || address.addressLine1;
  const street2 = address.street2 || address.addressLine2;
  const { city } = address;
  const state = address.state || address.stateCode;
  const zip = address.postalCode || address.zipCode;
  const country = address.country || address.countryCodeIso3;

  let display = '';
  if (street) display += street;
  if (street2) display += `, ${street2}`;
  if (city) display += `, ${city}`;
  if (state) display += `, ${state}`;
  if (zip) display += ` ${zip}`;
  if (country && country !== 'USA') {
    const label = countries.find(c => c.value === country)?.label || country;
    display += `, ${label}`;
  }

  return display.trim();
};

/**
 * Renders a line of address content followed by a <br />.
 * Returns null when content is falsy.
 *
 * @param {string|null} content
 * @returns {JSX.Element|null}
 */
export const addressConfirmationRenderLine = content =>
  content ? (
    <>
      {content}
      <br />
    </>
  ) : null;
