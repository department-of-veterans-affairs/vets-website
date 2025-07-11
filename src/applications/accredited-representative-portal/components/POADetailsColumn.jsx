import React from 'react';
import PropTypes from 'prop-types';
import {
  expiresSoon,
  resolutionDate,
  BANNER_TYPES,
} from '../utilities/poaRequests';

const POADetailsColumn = ({ poaRequest, poaStatus }) => {
  const poaRequestSubmission =
    poaRequest?.powerOfAttorneyFormSubmission?.status;
  return (
    <ul className="poa-request-details__list poa-request-details__list--col">
      <li className="poa-request-details__list-item">
        <p className="poa-request-details__title">Requested representative</p>
        <p className="poa-request-details__subtitle">
          {poaRequest?.powerOfAttorneyHolder?.name}
        </p>
      </li>
      <li className="poa-request-details__list-item">
        {poaRequest?.createdAt && (
          <>
            <p className="poa-request-details__title">Request submitted on</p>
            {resolutionDate(poaRequest?.createdAt, poaStatus.id)}
          </>
        )}
      </li>
      <li className="poa-request-details__list-item">
        {poaStatus === 'declination' && (
          <>
            <p className="poa-request-details__title">Request declined on</p>
            {resolutionDate(poaRequest.resolution?.createdAt, poaStatus.id)}
          </>
        )}
        {poaStatus === 'acceptance' && (
          <span
            className={
              (poaRequestSubmission === BANNER_TYPES.PROCESSING ||
                poaRequestSubmission === BANNER_TYPES.FAILED) &&
              'poa-request-details__visibility-hidden-dt'
            }
          >
            <p className="poa-request-details__title">
              <va-icon
                icon="check_circle"
                class="vads-u-color--success-dark poa-request__card-icon"
              />{' '}
              Request accepted on
            </p>
            {resolutionDate(poaRequest.resolution?.createdAt, poaStatus.id)}
          </span>
        )}
        {poaStatus === 'expiration' && (
          <>
            <p className="poa-request-details__title">Request expired on</p>
            {resolutionDate(poaRequest.resolution?.createdAt, poaStatus.id)}
          </>
        )}
        {poaStatus === 'Pending' && (
          <>
            <p className="poa-request-details__title">
              {expiresSoon(poaRequest.expiresAt) && (
                <va-icon
                  class="poa-request__card-icon"
                  icon="warning"
                  size={2}
                  srtext="warning"
                  aria-hidden="true"
                />
              )}
              Request expires on
            </p>
            {resolutionDate(poaRequest?.expiresAt, poaStatus.id)}
          </>
        )}
      </li>
    </ul>
  );
};

POADetailsColumn.propTypes = {
  poaRequest: PropTypes.object,
  poaStatus: PropTypes.string,
};

export default POADetailsColumn;
