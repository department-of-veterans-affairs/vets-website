import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import './POARequestsTable.scss';

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

const POARequestsTable = ({ poaRequests }) => {
  return (
    <ul
      data-testid="poa-request-card"
      className="poa-request__list"
      sort-column={1}
    >
      {poaRequests.map(({ id, attributes: poaRequest }) => (
        <li key={id}>
          <va-card class="poa-request__card">
            <Link
              data-testid={`poa-request-card-${id}-name`}
              to={`/poa-requests/${id}`}
            >
              <h3
                data-testid={`poa-request-card-${id}-name`}
                className="poa-request__card-title vads-u-font-size--h4"
              >
                {`${poaRequest.claimant.lastName},
                ${poaRequest.claimant.firstName}`}
              </h3>
            </Link>
            <p
              data-testid={`poa-request-card-${id}-relationship`}
              className="poa-request__card-subtitle"
            >
              {createRelationshipCell(poaRequest)}
            </p>

            <div className="poa-request__card-content">
              <div className="poa-request__card-field">
                <p
                  data-testid="poa-request-card-field-city"
                  className="poa-request__card-field-label"
                >
                  City
                </p>
                <p
                  data-testid={`poa-request-card-${id}-city`}
                  className="poa-request__card-field-value"
                >
                  {poaRequest.claimantAddress.city}
                </p>
              </div>

              <div className="poa-request__card-field">
                <p
                  data-testid="poa-request-card-field-state"
                  className="poa-request__card-field-label"
                >
                  State
                </p>
                <p
                  data-testid={`poa-request-card-${id}-state`}
                  className="poa-request__card-field-value"
                >
                  {poaRequest.claimantAddress.state}
                </p>
              </div>

              <div className="poa-request__card-field">
                <p
                  data-testid="poa-request-card-field-zip"
                  className="poa-request__card-field-label"
                >
                  Zip
                </p>
                <p
                  data-testid={`poa-request-card-${id}-zip`}
                  className="poa-request__card-field-value"
                >
                  {poaRequest.claimantAddress.zip}
                </p>
              </div>

              <div className="poa-request__card-field">
                <p
                  data-testid="poa-request-card-field-received"
                  className="poa-request__card-field-label"
                >
                  POA Received Date
                </p>
                <p
                  data-testid={`poa-request-card-${id}-received`}
                  className="poa-request__card-field-value"
                >
                  {formatDate(poaRequest.submittedAt)}
                </p>
              </div>

              <div className="poa-request__card-field">
                <p className="poa-request__card-field-label">
                  {poaRequest.status === 'Declined' && (
                    <va-icon
                      icon="close"
                      class="poa-request__card-icon--red poa-request__card-icon"
                    />
                  )}
                  {poaRequest.status === 'Accepted' && (
                    <va-icon
                      icon="check_circle"
                      class="poa-request__card-icon--green poa-request__card-icon"
                    />
                  )}
                  <span data-testid="poa-request-card-field-status">
                    POA Status
                  </span>
                </p>
                <p
                  data-testid={`poa-request-card-${id}-status`}
                  className="poa-request__card-field-value"
                >
                  {poaRequest.status}
                </p>
              </div>

              <div className="poa-request__card-field">
                <p className="poa-request__card-field-label">
                  <va-icon
                    class="poa-request__card-icon limitations-row__warning-icon"
                    icon="warning"
                    size={2}
                    srtext="warning"
                  />
                  <span data-testid="poa-request-card-field-consent">
                    Consent Limitations
                  </span>
                </p>
                <p className="poa-request__card-field-value">
                  {createLimitationsCell(
                    poaRequest.isTreatmentDisclosureAuthorized,
                    poaRequest.isAddressChangingAuthorized,
                  )}
                </p>
              </div>
            </div>
          </va-card>
        </li>
      ))}
    </ul>
  );
};

POARequestsTable.propTypes = {
  poaRequests: PropTypes.array.isRequired,
};

export default POARequestsTable;
