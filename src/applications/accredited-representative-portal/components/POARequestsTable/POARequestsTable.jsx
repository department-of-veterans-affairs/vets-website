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

const POARequestsTable = ({ poaRequest }) => {
  return (
    <ul
      data-testid="poa-requests-table"
      className="poa-requests__list"
      sort-column={1}
    >
      {poaRequest.map(({ id, attributes }) => (
        <li key={id}>
          <va-card class="poa-requests__card">
            <Link
              data-testid={`poa-requests-table-${id}-name`}
              to={`/poa-requests/${id}`}
            >
              <h3 className="poa-requests__card-title vads-u-font-size--h4">
                {`${attributes.claimant.lastName},
                ${attributes.claimant.firstName}`}
              </h3>
            </Link>
            <p className="poa-requests__card-subtitle">
              {createRelationshipCell(attributes)}
            </p>

            <div className="poa-requests__card-content">
              <div className="poa-requests__card-field">
                <p className="poa-requests__card-field-label">City</p>
                <p className="poa-requests__card-field-value">
                  {attributes.claimantAddress.city}
                </p>
              </div>

              <div className="poa-requests__card-field">
                <p className="poa-requests__card-field-label">State</p>
                <p className="poa-requests__card-field-value">
                  {attributes.claimantAddress.state}
                </p>
              </div>

              <div className="poa-requests__card-field">
                <p className="poa-requests__card-field-label">Zip</p>
                <p className="poa-requests__card-field-value">
                  {attributes.claimantAddress.zip}
                </p>
              </div>

              <div className="poa-requests__card-field">
                <p className="poa-requests__card-field-label">
                  POA Received Date
                </p>
                <p className="poa-requests__card-field-value">
                  {formatDate(attributes.submittedAt)}
                </p>
              </div>

              <div className="poa-requests__card-field">
                <p className="poa-requests__card-field-label">
                  {attributes.status === 'Declined' && (
                    <va-icon
                      icon="close"
                      class="poa-requests__card-icon--red poa-requests__card-icon"
                    />
                  )}
                  {attributes.status === 'Accepted' && (
                    <va-icon
                      icon="check_circle"
                      class="poa-requests__card-icon--green poa-requests__card-icon"
                    />
                  )}
                  POA Status
                </p>
                <p className="poa-requests__card-field-value">
                  {attributes.status}
                </p>
              </div>

              <div className="poa-requests__card-field">
                <p className="poa-requests__card-field-label">
                  <va-icon
                    class="poa-requests__card-icon limitations-row__warning-icon"
                    icon="warning"
                    size={2}
                    srtext="warning"
                  />
                  Consent Limitations
                </p>
                <p className="poa-requests__card-field-value">
                  {createLimitationsCell(
                    attributes.isTreatmentDisclosureAuthorized,
                    attributes.isAddressChangingAuthorized,
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
  poaRequest: PropTypes.array.isRequired,
};

export default POARequestsTable;
