import React from 'react';
import PropTypes from 'prop-types';

const StatementAddresses = ({ copay }) => {
  return (
    <section>
      <h2 data-testid="statement-address-head" id="statement-addresses">
        Statement Addresses
      </h2>
      <h3 data-testid="sender-address-head" className="vads-u-margin-top--0">
        Sender Address
      </h3>
      <p className="va-address-block vads-u-margin-left--0">
        <span data-testid="sender-facility-name">
          {copay.station.facilityName}
        </span>
        <br aria-hidden="true" />
        <span data-testid="sender-address-one">
          {copay.station.staTAddress1}
        </span>
        <br aria-hidden="true" />
        {copay.station.staTAddress2 && (
          <>
            <span data-testid="sender-address-two">
              {copay.station.staTAddress2}
            </span>
            <br aria-hidden="true" />
          </>
        )}
        {copay.station.staTAddress3 && (
          <>
            <span data-testid="sender-address-three">
              {copay.station.staTAddress3 ? copay.station.staTAddress3 : ''}
            </span>
            <br aria-hidden="true" />
          </>
        )}
        <span data-testid="sender-city-state-zip">
          {copay.station.city}, {copay.station.state} {copay.station.ziPCde}
        </span>
      </p>

      <h3 data-testid="recipient-address-head" className="vads-u-margin-top--0">
        Recipient Address
      </h3>
      <p className="va-address-block vads-u-margin-left--0">
        <span data-testid="recipient-address-one">{copay.pHAddress1}</span>
        <br aria-hidden="true" />
        {copay.pHAddress2 && (
          <>
            <span data-testid="recipient-address-two">{copay.pHAddress2}</span>
            <br aria-hidden="true" />
          </>
        )}
        {copay.pHAddress3 && (
          <>
            <span data-testid="recipient-address-three">
              {copay.pHAddress3}
            </span>
            <br aria-hidden="true" />
          </>
        )}
        <span data-testid="recipient-city-state-zip">
          {copay.pHCity}, {copay.pHState} {copay.pHZipCde}
        </span>
      </p>
      <p>
        <strong>Note:</strong> If your address has changed, call{' '}
        <va-telephone contact="8662602614" />.
      </p>
      {/* TODO: Once https://github.com/department-of-veterans-affairs/va.gov-team/issues/102858 is complete, this code needs to be updated with the correct variables. */}
    </section>
  );
};

StatementAddresses.propTypes = {
  copay: PropTypes.object,
};

export default StatementAddresses;
