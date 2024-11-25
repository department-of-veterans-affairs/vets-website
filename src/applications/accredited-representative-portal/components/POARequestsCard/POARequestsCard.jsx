import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

export const createRelationshipCell = attributes => {
  if ('veteran' in attributes) {
    return attributes?.claimant.relationshipToVeteran;
  }
  return 'Veteran';
};

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
      month: '2-digit',
      day: '2-digit',
    })
    .split('/');
  return `${month}-${day}-${year}`;
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
              <h3
                data-testid={`poa-request-card-${id}-name`}
                className="poa-request__card-title vads-u-font-size--h4"
              >
                {`${poaRequest.claimant.lastName}, ${
                  poaRequest.claimant.firstName
                }`}
              </h3>
            </Link>

            <p
              data-testid={`poa-request-card-${id}-city`}
              className="poa-request__card-field poa-request__card-field--location"
            >
              {poaRequest.claimantAddress.city},{' '}
              {poaRequest.claimantAddress.state},{' '}
              {poaRequest.claimantAddress.zip}
            </p>

            <p
              data-testid="poa-request-card-field-received"
              className="poa-request__card-field poa-request__card-field--request"
            >
              <va-icon
                class="poa-request__card-icon limitations-row__warning-icon"
                icon="warning"
                size={2}
                srtext="warning"
              />
              <span className="poa-request__card-field--label">
                POA request expires on:
              </span>
              <span data-testid={`poa-request-card-${id}-received`}>
                {formatDate(poaRequest.submittedAt)}
              </span>
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
