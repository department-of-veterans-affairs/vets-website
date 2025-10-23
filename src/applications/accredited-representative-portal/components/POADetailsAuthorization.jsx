import React from 'react';
import PropTypes from 'prop-types';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const POADetailsAuthorization = ({
  addressChange,
  recordDisclosureLimitations,
}) => {
  const Authorized = () => {
    return (
      <span>
        <va-icon
          size="3"
          icon="check_circle"
          class="vads-u-color--success-dark poa-request__card-icon"
        />
        Authorized
      </span>
    );
  };

  const NoAccess = () => {
    return (
      <span>
        <va-icon
          size="3"
          icon="warning"
          class="vads-u-color--warning-dark poa-request__card-icon"
        />
        Not authorized
      </span>
    );
  };

  const checkAuthorizations = x => {
    if (x) {
      return <NoAccess />;
    }
    return <Authorized />;
  };
  const checkLimitations = (limitations, limit) => {
    const checkLimitation = limitations.includes(limit);
    return checkAuthorizations(checkLimitation);
  };

  return (
    <>
      <h2 className="poa-request-details__h2 is--authorization-h2">
        Authorization information
      </h2>

      {recordDisclosureLimitations.length > 0 ? (
        <VaAdditionalInfo
          trigger="You won't have access to the claimant's eFolder in VBMS"
          uswds
        >
          <p>
            The claimant didn’t authorize access to all medical records. If you
            accept this request, representation will be established but you
            won’t have access to the claimant’s eFolder in the Veterans Benefits
            Management System (VBMS).
          </p>
        </VaAdditionalInfo>
      ) : (
        <VaAdditionalInfo
          trigger="You will have access to the claimant's eFolder in VBMS"
          uswds
        >
          <p>
            The claimant authorized access to all medical records. If you accept
            this request, representation will be established and you’ll have
            access to the claimant’s eFolder in the Veterans Benefits Management
            System (VBMS).
          </p>
        </VaAdditionalInfo>
      )}

      <h3 className="poa-request-details__h3 is--authorization-h3">
        Protected medical records access
      </h3>
      <ul className="poa-request-details__list poa-request-details__list--info">
        <li>
          <p>Alcoholism or alcohol abuse records</p>
          <p>{checkLimitations(recordDisclosureLimitations, 'ALCOHOLISM')}</p>
        </li>
        <li>
          <p>Drug abuse records</p>
          <p>{checkLimitations(recordDisclosureLimitations, 'DRUG_ABUSE')}</p>
        </li>
        <li>
          <p>HIV records</p>
          <p>{checkLimitations(recordDisclosureLimitations, 'HIV')}</p>
        </li>
        <li>
          <p>Sickle cell anemia records</p>
          <p>{checkLimitations(recordDisclosureLimitations, 'SICKLE_CELL')}</p>
        </li>
      </ul>
      <h3 className="poa-request-details__h3 is--authorization-h3">
        Claimant address
      </h3>
      <ul className="poa-request-details__list poa-request-details__list--info">
        <li>
          <p>Change of address</p>
          <p>{addressChange ? <Authorized /> : <NoAccess />}</p>
        </li>
      </ul>
    </>
  );
};

POADetailsAuthorization.propTypes = {
  addressChange: PropTypes.bool,
  recordDisclosureLimitations: PropTypes.array,
};

export default POADetailsAuthorization;
