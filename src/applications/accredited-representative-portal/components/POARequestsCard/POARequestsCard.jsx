import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

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

export const formatDate = date => {
  const [month, day, year] = new Date(date)
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .split(' ');
  return `${month} ${day} ${year}`;
};

export const checkDaysLeft = date => {
  const today = new Date();
  const diffInMs = new Date(date) - new Date(today);
  const numOfDays = diffInMs / (1000 * 60 * 60 * 24);
  if (numOfDays > 0 && numOfDays <= 7) {
    return (
      <va-icon
        class="poa-request__card-icon"
        icon="warning"
        size={2}
        srtext="warning"
        aria-hidden="true"
      />
    );
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
            <p
              data-testid={`poa-request-card-${id}-status`}
              className="poa-request__card-field poa-request__card-field--status"
            >
              {poaRequest.status}
            </p>
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
              ,
              <span data-testid={`poa-request-card-${id}-state`}>
                {poaRequest.claimantAddress.state}
              </span>
              ,
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
                    {formatDate(poaRequest.acceptedOrDeclinedAt)}
                  </span>
                </>
              )}
              {poaRequest.status === 'Accepted' && (
                <>
                  <span className="poa-request__card-field--label">
                    POA request accepted on:
                  </span>
                  <span data-testid={`poa-request-card-${id}-accepted`}>
                    {formatDate(poaRequest.acceptedOrDeclinedAt)}
                  </span>
                </>
              )}

              {poaRequest.status === 'Pending' && (
                <>
                  {checkDaysLeft(poaRequest.expiresAt)}
                  <span className="poa-request__card-field--label">
                    POA request expires on:
                  </span>
                  <span data-testid={`poa-request-card-${id}-received`}>
                    {formatDate(poaRequest.expiresAt)}
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
