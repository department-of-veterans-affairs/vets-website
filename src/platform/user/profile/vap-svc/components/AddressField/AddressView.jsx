import React from 'react';
import PropTypes from 'prop-types';

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

AddressView.propTypes = {
  data: PropTypes.object.isRequired,
};
