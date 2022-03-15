import React from 'react';
import PropTypes from 'prop-types';

const StatementAddresses = ({ copay }) => {
  return (
    <>
      <h2>Statement Addresses</h2>
      <dl>
        <dt className="vads-u-font-weight--bold">Sender Address</dt>
        <dd>
          <span>{copay.station.facilityName}</span>
          <br />
          <span>{copay.station.staTAddress1}</span>
          <br />
          {copay.station.staTAddress2 && (
            <>
              <span>{copay.station.staTAddress2}</span>
              <br />
            </>
          )}
          {copay.station.staTAddress3 && (
            <>
              <span>
                {copay.station.staTAddress3 ? copay.station.staTAddress3 : ''}
              </span>
              <br />
            </>
          )}
          <span>
            {copay.station.city}, {copay.station.state} {copay.station.ziPCde}
          </span>
        </dd>
        <dt className="vads-u-font-weight--bold">Sender Address</dt>
        <dd>
          <span>{copay.pHAddress1}</span>
          <br />
          {copay.pHAddress2 && (
            <>
              <span>{copay.pHAddress2}</span>
              <br />
            </>
          )}
          {copay.pHAddress3 && (
            <>
              <span>{copay.pHAddress3 ? copay.pHAddress3 : ''}</span>
              <br />
            </>
          )}
          <span>
            {copay.pHCity}, {copay.pHState} {copay.pHZipCde}
          </span>
        </dd>
      </dl>
    </>
  );
};

StatementAddresses.propTypes = {
  copay: PropTypes.object,
};

export default StatementAddresses;
