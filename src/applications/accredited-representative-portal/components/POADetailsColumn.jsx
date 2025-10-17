import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { resolutionDate, checkReason } from '../utilities/poaRequests';

const response = (poaStatus, poaRequest, poaRequestSubmission) => {
  focusElement('.poa__submit-response');
  switch (poaStatus) {
    case 'declination':
      return (
        <p className="poa__submit-response">
          <strong>Response:</strong>{' '}
          {poaRequest?.resolution?.accreditedIndividual?.fullName ||
            'Your organization'}{' '}
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
        <p className="poa__submit-response">
          <strong>Response:</strong>{' '}
          {poaRequest?.resolution?.accreditedIndividual?.fullName ||
            'Your organization'}{' '}
          accepted this request on{' '}
          {resolutionDate(poaRequest?.resolution?.createdAt, poaStatus.id)}. We
          processed the request and representation has been established.
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
          <p className="poa-request-details__title">Requested organization</p>
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
              {poaRequest?.accreditedIndividual?.fullName || 'None selected'}
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
