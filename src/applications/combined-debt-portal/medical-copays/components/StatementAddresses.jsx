import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { showVHAPaymentHistory } from '../../combined/utils/helpers';

const StatementAddresses = ({ copay }) => {
  const shouldShowVHAPaymentHistory = useSelector(state =>
    showVHAPaymentHistory(state),
  );

  const normalizeVHACopay = () => {
    const facilityName = copay?.attributes?.facility.name;
    const facilityAddress = copay?.attributes?.facility?.address;
    const patientAddress = copay?.attributes?.patient?.address;
    return {
      facility: facilityName,
      statementAddress1: facilityAddress?.addressLine1,
      statementAddress2: facilityAddress?.addressLine2,
      statementAddress3: facilityAddress?.addressLine3,
      statementCity: facilityAddress?.city,
      statementZip: facilityAddress?.postalCode,
      statementState: facilityAddress?.state,
      recipientAddress1: patientAddress?.addressLine1,
      recipientAddress2: patientAddress?.addressLine2,
      recipientAddress3: patientAddress?.addressLine3,
      recipientCity: patientAddress?.city,
      recipientZip: patientAddress?.postalCode,
      recipientState: patientAddress?.state,
    };
  };

  const normalizeStandardCopay = () => {
    const station = copay?.station;
    return {
      facility: station?.facilityName,
      statementAddress1: station?.staTAddress1,
      statementAddress2: station?.staTAddress2,
      statementAddress3: station?.staTAddress3,
      statementCity: station?.city,
      statementZip: station?.ziPCde,
      statementState: station?.state,
      recipientAddress1: station?.recipientAddress1,
      recipientAddress2: station?.recipientAddress2,
      recipientAddress3: station?.recipientAddress3,
      recipientCity: copay?.pHCity,
      recipientZip: copay?.pHZipCde,
      recipientState: copay?.pHState,
    };
  };

  const normalizedCopay = shouldShowVHAPaymentHistory
    ? normalizeVHACopay()
    : normalizeStandardCopay();

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
