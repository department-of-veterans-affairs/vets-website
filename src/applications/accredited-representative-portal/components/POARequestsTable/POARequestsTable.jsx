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
      data-testid="poa-requests-table"
      className="poa-requests__list"
      sort-column={1}
    >
      {poaRequests.map(({ id, attributes }) => (
        <li key={id}>
          <va-card class="poa-requests__card">
            <Link
              data-testid={`poa-requests-table-${id}-name`}
              to={`/poa-requests/${id}`}
            >
              <h3 className="poa-requests__card-name vads-u-font-size--h4">
                {`${attributes.claimant.lastName},
                ${attributes.claimant.firstName}`}
              </h3>
            </Link>
            <p className="poa-requests__card-group">
              {createRelationshipCell(attributes)}
            </p>

            <div className="poa-requests__row">
              <div className="poa-requests__col">
                <p className="poa-requests__card-label">City</p>
                <p className="poa-requests__card-data">
                  {attributes.claimantAddress.city}
                </p>
              </div>

              <div className="poa-requests__col">
                <p className="poa-requests__card-label">State</p>
                <p className="poa-requests__card-data">
                  {attributes.claimantAddress.state}
                </p>
              </div>

              <div className="poa-requests__col">
                <p className="poa-requests__card-label">Zip</p>
                <p className="poa-requests__card-data">
                  {attributes.claimantAddress.zip}
                </p>
              </div>

              <div className="poa-requests__col">
                <p className="poa-requests__card-label">POA Received Date</p>
                <p className="poa-requests__card-data">
                  {formatDate(attributes.submittedAt)}
                </p>
              </div>

              <div className="poa-requests__col">
                <p className="poa-requests__card-label">
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
                <p className="poa-requests__card-data">{attributes.status}</p>
              </div>

              <div className="poa-requests__col">
                <p className="poa-requests__card-label">
                  <va-icon
                    class="poa-requests__card-icon limitations-row__warning-icon"
                    icon="warning"
                    size={2}
                    srtext="warning"
                  />
                  Consent Limitations
                </p>
                <p className="poa-requests__card-data">
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
  poaRequests: PropTypes.array.isRequired,
};

export default POARequestsTable;
