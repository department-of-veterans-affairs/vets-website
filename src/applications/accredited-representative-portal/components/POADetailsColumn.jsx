import React from 'react';
import PropTypes from 'prop-types';
import { resolutionDate, checkReason } from '../utilities/poaRequests';

const response = (poaStatus, poaRequest, poaRequestSubmission) => {
  switch (poaStatus) {
    case 'declination':
      return (
        <p>
          <strong>Response:</strong>{' '}
          {poaRequest?.resolution?.accreditedIndividual || 'Your organization'}{' '}
          declined this request on{' '}
          {resolutionDate(poaRequest?.resolution?.createdAt, poaStatus.id)}{' '}
          {checkReason(poaRequest)}
        </p>
      );
    case 'acceptance':
      if (
        poaRequestSubmission === 'PENDING' ||
        poaRequestSubmission === 'FAILED'
      ) {
        return null;
      }
      return (
        <p>
          <strong>Response:</strong>{' '}
          {poaRequest?.resolution?.accreditedIndividual || 'Your organization'}{' '}
          accepted this request on{' '}
          {resolutionDate(poaRequest?.resolution?.createdAt, poaStatus.id)}. We
          processed the request and power of attorney has been established.
        </p>
      );

    default:
      return null;
  }
};
const POADetailsColumn = ({ poaRequest, poaStatus }) => {
  const poaRequestSubmission =
    poaRequest?.powerOfAttorneyFormSubmission?.status;
  return (
    <>
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
              <p className="poa-request-details__title">
                Preferred representative
              </p>
              {poaRequest?.resolution?.accreditedIndividual || 'None selected'}
            </>
          )}
        </li>
        <li className="poa-request-details__list-item">
          {poaRequest?.createdAt && (
            <>
              <p className="poa-request-details__title">Request submitted on</p>
              {resolutionDate(poaRequest?.createdAt, poaStatus.id)}
            </>
          )}
        </li>
      </ul>
      {response(poaStatus, poaRequest, poaRequestSubmission)}
    </>
  );
};

POADetailsColumn.propTypes = {
  poaRequest: PropTypes.object,
  poaStatus: PropTypes.string,
};

export default POADetailsColumn;
