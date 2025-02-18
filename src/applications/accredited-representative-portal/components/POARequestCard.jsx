import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  expiresSoon,
  formatStatus,
  resolutionDate,
} from '../utilities/poaRequests';

const POARequestCard = ({ poaRequest }) => {
  const lastName = poaRequest?.powerOfAttorneyForm?.claimant?.name?.last;
  const firstName = poaRequest?.powerOfAttorneyForm?.claimant?.name?.first;
  const city = poaRequest?.powerOfAttorneyForm?.claimant?.address.city;
  const state = poaRequest?.powerOfAttorneyForm?.claimant?.address.stateCode;
  const zipCode = poaRequest?.powerOfAttorneyForm?.claimant?.address.zipCode;
  const poaStatus =
    poaRequest.resolution?.decisionType || poaRequest.resolution?.type;

  return (
    <li>
      <va-card class="poa-request__card">
        <span
          data-testid={`poa-request-card-${poaRequest.id}-status`}
          className={`usa-label poa-request__card-field poa-request__card-field--status status status--${poaStatus}`}
        >
          {formatStatus(poaStatus)}
        </span>
        <Link to={`/poa-requests/${poaRequest.id}`}>
          <span className="sr-only">View details for </span>
          <h3
            data-testid={`poa-request-card-${poaRequest.id}-name`}
            className="poa-request__card-title vads-u-font-size--h4"
          >
            {`${lastName}, ${firstName}`}
          </h3>
        </Link>

        <p className="poa-request__card-field poa-request__card-field--location">
          <span data-testid={`poa-request-card-${poaRequest.id}-city`}>
            {city}
          </span>
          {', '}
          <span data-testid={`poa-request-card-${poaRequest.id}-state`}>
            {state}
          </span>
          {', '}
          <span data-testid={`poa-request-card-${poaRequest.id}-zip`}>
            {zipCode}
          </span>
        </p>

        <p
          data-testid="poa-request-card-field-received"
          className="poa-request__card-field poa-request__card-field--request"
        >
          {poaStatus === 'declination' && (
            <>
              <span className="poa-request__card-field--label">
                POA request declined on:
              </span>
              {resolutionDate(poaRequest.resolution?.createdAt, poaRequest.id)}
            </>
          )}
          {poaStatus === 'acceptance' && (
            <>
              <span className="poa-request__card-field--label">
                POA request accepted on:
              </span>
              {resolutionDate(poaRequest.resolution?.createdAt, poaRequest.id)}
            </>
          )}

          {poaStatus === 'expiration' && (
            <>
              <span className="poa-request__card-field--label">
                POA request expired on:
              </span>
              {resolutionDate(poaRequest.resolution?.createdAt, poaRequest.id)}
            </>
          )}

          {!poaRequest.resolution && (
            <>
              {expiresSoon(poaRequest.expiresAt) && (
                <va-icon
                  class="poa-request__card-icon"
                  icon="warning"
                  size={2}
                  srtext="warning"
                  aria-hidden="true"
                />
              )}
              <span className="poa-request__card-field--label">
                POA request expires on:
              </span>
              {resolutionDate(poaRequest.expiresAt, poaRequest.id)}
              <span className="poa-request__card-field--expiry">
                {expiresSoon(poaRequest.expiresAt)}
              </span>
            </>
          )}
        </p>
      </va-card>
    </li>
  );
};

POARequestCard.propTypes = {
  cssClass: PropTypes.string,
  id: PropTypes.string,
  poaRequest: PropTypes.object,
};

export default POARequestCard;
