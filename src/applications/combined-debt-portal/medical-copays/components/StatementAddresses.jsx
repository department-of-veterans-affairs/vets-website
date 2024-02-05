import React from 'react';
import PropTypes from 'prop-types';

const StatementAddresses = ({ copay }) => {
  return (
    <>
      <h2 data-testid="statement-address-head" id="statement-addresses">
        Statement Addresses
      </h2>
      <dl>
        <dt
          className="vads-u-font-size--h4 vads-u-font-family--serif vads-u-font-weight--bold"
          data-testid="sender-address-head"
        >
          Sender Address
        </dt>
        <dd>
          <span data-testid="sender-facility-name">
            {copay.station.facilityName}
          </span>
          <br />
          <span data-testid="sender-address-one">
            {copay.station.staTAddress1}
          </span>
          <br />
          {copay.station.staTAddress2 && (
            <>
              <span data-testid="sender-address-two">
                {copay.station.staTAddress2}
              </span>
              <br />
            </>
          )}
          {copay.station.staTAddress3 && (
            <>
              <span data-testid="sender-address-three">
                {copay.station.staTAddress3 ? copay.station.staTAddress3 : ''}
              </span>
              <br />
            </>
          )}
          <span data-testid="sender-city-state-zip">
            {copay.station.city}, {copay.station.state} {copay.station.ziPCde}
          </span>
        </dd>
        <dt
          className="vads-u-font-size--h4 vads-u-font-family--serif vads-u-font-weight--bold"
          data-testid="recipient-address-head"
        >
          Recipient Address
        </dt>
        <dd>
          <span data-testid="recipient-address-one">{copay.pHAddress1}</span>
          <br />
          {copay.pHAddress2 && (
            <>
              <span data-testid="recipient-address-two">
                {copay.pHAddress2}
              </span>
              <br />
            </>
          )}
          {copay.pHAddress3 && (
            <>
              <span data-testid="recipient-address-three">
                {copay.pHAddress3}
              </span>
              <br />
            </>
          )}
          <span data-testid="recipient-city-state-zip">
            {copay.pHCity}, {copay.pHState} {copay.pHZipCde}
          </span>
          <p>
            <strong>Note:</strong> If your address has changed, call &nbsp;
            <span>
              <va-telephone contact="8662602614" international="true" uswds />.
            </span>
          </p>
        </dd>
      </dl>
    </>
  );
};

StatementAddresses.propTypes = {
  copay: PropTypes.object,
};

export default StatementAddresses;
