import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

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

  return limitations.length > 0 ? (
    <span className="limitations-row">
      <va-icon
        class="limitations-row__warning-icon"
        icon="warning"
        size={3}
        srtext="warning"
      />
      {limitations.join(', ')}
    </span>
  ) : (
    'None'
  );
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
    <va-table data-testid="poa-requests-table" sort-column={1}>
      <va-table-row slot="headers">
        <span data-testid="poa-requests-table-headers-status">Status</span>
        <span data-testid="poa-requests-table-headers-name">
          Veteran/Claimant
        </span>
        <span data-testid="poa-requests-table-headers-limitations">
          Limitations of consent
        </span>
        <span data-testid="poa-requests-table-headers-city">City</span>
        <span data-testid="poa-requests-table-headers-state">State</span>
        <span data-testid="poa-requests-table-headers-zip">Zip</span>
        <span data-testid="poa-requests-table-headers-received">
          Date received
        </span>
      </va-table-row>
      {poaRequests.map(({ id, attributes }) => (
        <va-table-row key={id}>
          <span data-testid={`poa-requests-table-${id}-status`}>
            {upperFirst(attributes.status)}
          </span>
          <span>
            <Link
              data-testid={`poa-requests-table-${id}-name`}
              to={`/poa-requests/${id}`}
            >
              {`${attributes.claimant.lastName}, ${
                attributes.claimant.firstName
              }`}
            </Link>
            <span
              data-testid={`poa-requests-table-${id}-relationship`}
              className="relationship-row"
            >
              {createRelationshipCell(attributes)}
            </span>
          </span>
          <span data-testid={`poa-requests-table-${id}-limitations`}>
            {createLimitationsCell(
              attributes.isTreatmentDisclosureAuthorized,
              attributes.isAddressChangingAuthorized,
            )}
          </span>
          <span data-testid={`poa-requests-table-${id}-city`}>
            {attributes.claimantAddress.city}
          </span>
          <span data-testid={`poa-requests-table-${id}-state`}>
            {attributes.claimantAddress.state}
          </span>
          <span data-testid={`poa-requests-table-${id}-zip`}>
            {attributes.claimantAddress.zip}
          </span>
          <span data-testid={`poa-requests-table-${id}-received`}>
            {formatDate(attributes.submittedAt)}
          </span>
        </va-table-row>
      ))}
    </va-table>
  );
};

POARequestsTable.propTypes = {
  poaRequests: PropTypes.array.isRequired,
};

export default POARequestsTable;
