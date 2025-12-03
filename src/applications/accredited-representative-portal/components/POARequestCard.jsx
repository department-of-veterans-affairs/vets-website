import React from 'react';
import PropTypes from 'prop-types';
import {
  expiresSoon,
  formatStatus,
  expiresSoonIcon,
  resolutionDate,
  formSubmissionStatus,
  hideStatus,
} from '../utilities/poaRequests';
import { recordDatalayerEvent } from '../utilities/analytics';

const POARequestCard = ({ poaRequest }) => {
  const lastName = poaRequest?.powerOfAttorneyForm?.claimant?.name?.last;
  const firstName = poaRequest?.powerOfAttorneyForm?.claimant?.name?.first;
  const city = poaRequest?.powerOfAttorneyForm?.claimant?.address.city;
  const state = poaRequest?.powerOfAttorneyForm?.claimant?.address.stateCode;
  const zipCode = poaRequest?.powerOfAttorneyForm?.claimant?.address.zipCode;
  const requestedOrg = poaRequest?.powerOfAttorneyHolder?.name;
  const requestedRep =
    poaRequest?.accreditedIndividual?.fullName || 'None selected';
  const poaStatus =
    poaRequest.resolution?.decisionType || poaRequest.resolution?.type;
  const poaRequestSubmission =
    poaRequest?.powerOfAttorneyFormSubmission?.status;
  return (
    <li>
      <va-card class="poa-request__card">
        <span
          data-testid={`poa-request-card-${poaRequest.id}-status`}
          className={`usa-label poa-request__card-field poa-request__card-field--status status status--processing ${hideStatus(
            poaRequestSubmission,
          )}`}
        >
          {formatStatus(poaStatus)}
        </span>
        <h3
          data-testid={`poa-request-card-${poaRequest.id}-name`}
          className="poa-request__card-title vads-u-font-family--serif"
        >
          {`${lastName}, ${firstName}`}
        </h3>

        <p className="poa-request__card-field">
          <span data-testid={`poa-request-card-${poaRequest.id}-city`}>
            {city}
          </span>
          {', '}
          <span data-testid={`poa-request-card-${poaRequest.id}-state`}>
            {state}
          </span>
          <span data-testid={`poa-request-card-${poaRequest.id}-zip`}>
            {' '}
            {zipCode}
          </span>
        </p>

        <p className="poa-request__card-field--label poa-request__card-field--org">
          Requested organization: <span>{requestedOrg}</span>
        </p>
        <p className="poa-request__card-field--label">
          Preferred representative: <span>{requestedRep}</span>
        </p>
        <p
          data-testid="poa-request-card-field-received"
          className="poa-request__card-field poa-request__card-field--request"
        >
          {poaStatus === 'declination' && (
            <span
              className={`poa-request__card-field--label ${hideStatus(
                poaRequestSubmission,
              )}`}
            >
              Request declined on:
              {resolutionDate(poaRequest.resolution?.createdAt, poaRequest.id)}
            </span>
          )}
          {poaStatus === 'acceptance' && (
            <span
              className={`poa-request__card-field--label ${hideStatus(
                poaRequestSubmission,
              )}`}
            >
              Request accepted on:
              <span>
                {resolutionDate(
                  poaRequest.resolution?.createdAt,
                  poaRequest.id,
                )}
              </span>
            </span>
          )}

          {poaStatus === 'expiration' && (
            <span
              className={`poa-request__card-field--label ${hideStatus(
                poaRequestSubmission,
              )}`}
            >
              Request expired on:
              <span>
                {resolutionDate(
                  poaRequest.resolution?.createdAt,
                  poaRequest.id,
                )}
              </span>
            </span>
          )}

          {formSubmissionStatus(poaRequestSubmission)}

          {!poaRequest.resolution && (
            <>
              {expiresSoonIcon(poaRequest.expiresAt) && (
                <va-icon
                  class="poa-request__card-icon"
                  icon="warning"
                  size={2}
                  srtext="warning"
                  aria-hidden="true"
                />
              )}
              <span className="poa-request__card-field--label">
                Request submitted on:
              </span>
              {resolutionDate(poaRequest.createdAt, poaRequest.id)}
              <span className="poa-request__card-field--expiry">
                {expiresSoon(poaRequest.expiresAt)}
              </span>
            </>
          )}
        </p>
        <va-link
          active
          disable-analytics
          href={`/representative/representation-requests/${poaRequest.id}`}
          onClick={recordDatalayerEvent}
          data-eventname="arp-card"
          text="View representation request"
        />
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
