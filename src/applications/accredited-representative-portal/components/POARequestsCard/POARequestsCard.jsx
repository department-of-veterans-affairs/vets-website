import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  formatDateParsedZoneLong,
  timeFromNow,
} from 'platform/utilities/date/index';
import { differenceInDays } from 'date-fns';

export const createLimitationsCell = (
  isTreatmentDisclosureAuthorized,
  isAddressChangingAuthorized,
) => {
  const limitations = [];

  // If do not authorize sharing health info or authorize change of address then we label it as a limitation of consent
  if (!isTreatmentDisclosureAuthorized) limitations.push('Health');
  if (!isAddressChangingAuthorized) limitations.push('Address');

  return limitations.length > 0 ? limitations.join(', ') : 'None';
};

const expiresSoon = expDate => {
  const EXPIRES_SOON_THRESHOLD_DURATION = 7 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const expiresAt = new Date(expDate);
  const daysLeft = timeFromNow(expiresAt, now);
  if (
    differenceInDays(expiresAt, now) > 0 &&
    differenceInDays(expiresAt, now) < EXPIRES_SOON_THRESHOLD_DURATION
  ) {
    return `(in ${daysLeft})`;
  }
  return null;
};

const POARequestsCard = ({ poaRequests }) => {
  return (
    <ul
      data-testid="poa-requests-card"
      className="poa-request__list"
      sort-column={1}
    >
      {poaRequests.map(({ id, attributes: poaRequest }) => (
        <li key={id}>
          <va-card class="poa-request__card">
            <span
              data-testid={`poa-request-card-${id}-status`}
              className="usa-label poa-request__card-field"
            >
              {poaRequest.status}
            </span>
            <Link to={`/poa-requests/${id}`}>
              <span className="sr-only">View details for </span>
              <h3
                data-testid={`poa-request-card-${id}-name`}
                className="poa-request__card-title vads-u-font-size--h4"
              >
                {`${poaRequest.claimant.lastName}, ${
                  poaRequest.claimant.firstName
                }`}
              </h3>
            </Link>

            <p className="poa-request__card-field poa-request__card-field--location">
              <span data-testid={`poa-request-card-${id}-city`}>
                {poaRequest.claimantAddress.city}
              </span>
              {', '}
              <span data-testid={`poa-request-card-${id}-state`}>
                {poaRequest.claimantAddress.state}
              </span>
              {', '}
              <span data-testid={`poa-request-card-${id}-zip`}>
                {poaRequest.claimantAddress.zip}
              </span>
            </p>

            <p
              data-testid="poa-request-card-field-received"
              className="poa-request__card-field poa-request__card-field--request"
            >
              {poaRequest.status === 'Declined' && (
                <>
                  <span className="poa-request__card-field--label">
                    POA request declined on:
                  </span>
                  <span data-testid={`poa-request-card-${id}-declined`}>
                    {formatDateParsedZoneLong(poaRequest.acceptedOrDeclinedAt)}
                  </span>
                </>
              )}
              {poaRequest.status === 'Accepted' && (
                <>
                  <span className="poa-request__card-field--label">
                    POA request accepted on:
                  </span>
                  <span data-testid={`poa-request-card-${id}-accepted`}>
                    {formatDateParsedZoneLong(poaRequest.acceptedOrDeclinedAt)}
                  </span>
                </>
              )}

              {poaRequest.status === 'Pending' && (
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
                  <span data-testid={`poa-request-card-${id}-received`}>
                    {formatDateParsedZoneLong(poaRequest.expiresAt)}
                  </span>
                  <span className="poa-request__card-field--expiry">
                    {expiresSoon(poaRequest.expiresAt)}
                  </span>
                </>
              )}
            </p>
          </va-card>
        </li>
      ))}
    </ul>
  );
};

POARequestsCard.propTypes = {
  poaRequests: PropTypes.array.isRequired,
};

export default POARequestsCard;
