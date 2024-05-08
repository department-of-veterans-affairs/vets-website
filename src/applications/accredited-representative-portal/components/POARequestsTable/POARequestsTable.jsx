import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

export const createRelationshipCell = attributes => {
  if ('veteran' in attributes) {
    return attributes?.claimant.relationship;
  }
  return 'Veteran';
};

export const createLimitationsCell = (healthInfoAuth, changeAddressAuth) => {
  const limitations = [];

  // If do not authorize sharing health info or authorize change of address then we label it as a limitation of consent
  if (healthInfoAuth === 'N') limitations.push('Health');
  if (changeAddressAuth === 'N') limitations.push('Address');

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
  const [year, month, day] = date.split('-');
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
          POA received date
        </span>
      </va-table-row>
      {poaRequests.map(({ procId, attributes }) => (
        <va-table-row key={procId}>
          <span data-testid={`poa-requests-table-${procId}-status`}>
            {upperFirst(attributes.secondaryStatus)}
          </span>
          <span>
            <Link
              data-testid={`poa-requests-table-${procId}-name`}
              to={`/poa-requests/${procId}`}
            >
              {`${attributes.claimant.lastName}, ${
                attributes.claimant.firstName
              }`}
            </Link>
            <span
              data-testid={`poa-requests-table-${procId}-relationship`}
              className="relationship-row"
            >
              {createRelationshipCell(attributes)}
            </span>
          </span>
          <span data-testid={`poa-requests-table-${procId}-limitations`}>
            {createLimitationsCell(
              attributes.healthInfoAuth,
              attributes.changeAddressAuth,
            )}
          </span>
          <span data-testid={`poa-requests-table-${procId}-city`}>
            {attributes.claimant.city}
          </span>
          <span data-testid={`poa-requests-table-${procId}-state`}>
            {attributes.claimant.state}
          </span>
          <span data-testid={`poa-requests-table-${procId}-zip`}>
            {attributes.claimant.zip}
          </span>
          <span data-testid={`poa-requests-table-${procId}-received`}>
            {formatDate(attributes.dateRequestReceived)}
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
