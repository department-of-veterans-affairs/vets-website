/**
 * @module AddressView
 * @description Presentational component that displays a formatted address in read-only view.
 * Uses platform-level address formatting helpers and includes Datadog RUM privacy controls.
 *
 * @param {Object} props
 * @param {Object} props.data - Address object containing address fields
 * @param {string} props.data.addressLine1 - Street address line 1
 * @param {string} props.data.addressLine2 - Street address line 2 (optional)
 * @param {string} props.data.addressLine3 - Street address line 3 (optional)
 * @param {string} props.data.city - City name
 * @param {string} props.data.stateCode - State code (US addresses)
 * @param {string} props.data.zipCode - ZIP code (US addresses)
 * @param {string} props.data.countryName - Country name
 * @returns {JSX.Element} Formatted address display
 *
 * @example
 * import AddressView from '@@vap-svc/components/AddressField/AddressView';
 *
 * <AddressView data={mailingAddress} />
 */

import React from 'react';

import { formatAddress } from 'platform/forms/address/helpers';

export default function AddressView({ data: address }) {
  const { street, cityStateZip, country } = formatAddress(address);

  // Not hiding the country in Datadog RUM in case we encounter an issue with an
  // international address
  return (
    <>
      <div className="dd-privacy-hidden" data-dd-action-name="street">
        {street}
      </div>
      <div
        className="dd-privacy-hidden"
        data-dd-action-name="city, state and zip code"
      >
        {cityStateZip}
      </div>
      {country && <div>{country}</div>}
    </>
  );
}
