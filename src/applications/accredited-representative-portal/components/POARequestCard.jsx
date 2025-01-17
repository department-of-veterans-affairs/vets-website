import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  expiresSoon,
  formatStatus,
  resolutionDate,
} from '../utilities/poaRequests';

const POARequestCard = ({ poaRequest, id }) => {
  const lastName = poaRequest?.power_of_attorney_form?.claimant?.name?.last;
  const firstName = poaRequest?.power_of_attorney_form?.claimant?.name?.first;
  const city = poaRequest?.power_of_attorney_form?.claimant?.address.city;
  const state =
    poaRequest?.power_of_attorney_form?.claimant?.address.state_code;
  const zipCode =
    poaRequest?.power_of_attorney_form?.claimant?.address.zip_code;
  const poaStatus =
    poaRequest.resolution?.decision_type || poaRequest.resolution?.type;
  return (
    <li>
      <va-card class="poa-request__card">
        <span
          data-testid={`poa-request-card-${id}-status`}
          className="usa-label poa-request__card-field poa-request__card-field--status"
        >
          {formatStatus(poaStatus)}
        </span>
        <Link to={`/poa-requests/${poaRequest.id}`}>
          <span className="sr-only">View details for </span>
          <h3
            data-testid={`poa-request-card-${id}-name`}
            className="poa-request__card-title vads-u-font-size--h4"
          >
            {`${lastName}, ${firstName}`}
          </h3>
        </Link>

        <p className="poa-request__card-field poa-request__card-field--location">
          <span data-testid={`poa-request-card-${id}-city`}>{city}</span>
          {', '}
          <span data-testid={`poa-request-card-${id}-state`}>{state}</span>
          {', '}
          <span data-testid={`poa-request-card-${id}-zip`}>{zipCode}</span>
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
              {resolutionDate(poaRequest.resolution?.created_at, id)}
            </>
          )}
          {poaStatus === 'acceptance' && (
            <>
              <span className="poa-request__card-field--label">
                POA request accepted on:
              </span>
              {resolutionDate(poaRequest.resolution?.created_at, id)}
            </>
          )}

          {poaStatus === 'expiration' && (
            <>
              <span className="poa-request__card-field--label">
                POA request expired on:
              </span>
              {resolutionDate(poaRequest.resolution?.created_at, id)}
            </>
          )}

          {!poaRequest.resolution && (
            <>
              {expiresSoon(poaRequest.expires_at) && (
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
              {resolutionDate(poaRequest.expires_at, id)}
              <span className="poa-request__card-field--expiry">
                {expiresSoon(poaRequest.expires_at)}
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
