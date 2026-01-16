import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { showVHAPaymentHistory } from '../../combined/utils/helpers';

const StatementAddresses = ({ copay }) => {
  const shouldShowVHAPaymentHistory = useSelector(state =>
    showVHAPaymentHistory(state),
  );

  const normalizedCopay = {
    facility: shouldShowVHAPaymentHistory
      ? copay.attributes.facility
      : copay.station.facilityName,
    statementAddress1: shouldShowVHAPaymentHistory
      ? copay.attributes.address1
      : copay.station.staTAddress1,
    statementAddress2: shouldShowVHAPaymentHistory
      ? copay.attributes.address2
      : copay.station.staTAddress2,
    statementAddress3: shouldShowVHAPaymentHistory
      ? copay.attributes.address3
      : copay.station.staTAddress3,
    statementCity: shouldShowVHAPaymentHistory
      ? copay.attributes.city
      : copay.station.city,
    statementZip: shouldShowVHAPaymentHistory
      ? copay.attributes.zip
      : copay.station.ziPCde,
    statementState: shouldShowVHAPaymentHistory
      ? copay.attributes.state
      : copay.station.state,
    recipientAddress1: shouldShowVHAPaymentHistory
      ? copay.attributes.recipientAddress1
      : copay.station.recipientAddress1,
    recipientAddress2: shouldShowVHAPaymentHistory
      ? copay.attributes.recipientAddress2
      : copay.station.recipientAddress2,
    recipientAddress3: shouldShowVHAPaymentHistory
      ? copay.attributes.recipientAddress3
      : copay.station.recipientAddress3,
    recipientCity: shouldShowVHAPaymentHistory
      ? copay.attributes.recipientCity
      : copay.pHCity,
    recipientZip: shouldShowVHAPaymentHistory
      ? copay.attributes.recipientZip
      : copay.pHZipCde,
    recipientState: shouldShowVHAPaymentHistory
      ? copay.attributes.state
      : copay.pHState,
  };

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
          {normalizedCopay.facility}
        </span>
        <br aria-hidden="true" />
        <span data-testid="sender-address-one">
          {normalizedCopay.statementAddress1}
        </span>
        <br aria-hidden="true" />
        {normalizedCopay.statementAddress2 && (
          <>
            <span data-testid="sender-address-two">
              {normalizedCopay.statementAddress2}
            </span>
            <br aria-hidden="true" />
          </>
        )}
        {normalizedCopay.statementAddress3 && (
          <>
            <span data-testid="sender-address-three">
              {normalizedCopay.statementAddress3}
            </span>
            <br aria-hidden="true" />
          </>
        )}
        <span data-testid="sender-city-state-zip">
          {normalizedCopay.statementCity}, {normalizedCopay.statementState}{' '}
          {normalizedCopay.statementZip}
        </span>
      </p>

      <h3 data-testid="recipient-address-head" className="vads-u-margin-top--0">
        Recipient Address
      </h3>
      <p className="va-address-block vads-u-margin-left--0">
        <span data-testid="recipient-address-one">
          {normalizedCopay.recipientAddress1}
        </span>
        <br aria-hidden="true" />
        {normalizedCopay.recipientAddress2 && (
          <>
            <span data-testid="recipient-address-two">
              {normalizedCopay.recipientAddress2}
            </span>
            <br aria-hidden="true" />
          </>
        )}
        {normalizedCopay.recipientAddress3 && (
          <>
            <span data-testid="recipient-address-three">
              {normalizedCopay.recipientAddress3}
            </span>
            <br aria-hidden="true" />
          </>
        )}
        <span data-testid="recipient-city-state-zip">
          {normalizedCopay.recipientCity}, {normalizedCopay.recipientState}{' '}
          {normalizedCopay.recipientZip}
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
