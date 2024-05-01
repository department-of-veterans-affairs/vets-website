import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import './POARequestsTable.scss';

const formatDate = date => {
  const [year, month, day] = date.split('-');
  return `${month}-${day}-${year}`;
};

const createLimitationsCell = (healthInfo, changeAddress) => {
  let text = null;
  if (healthInfo === 'Y' && changeAddress === 'Y') {
    text = 'Health, Address';
  } else if (healthInfo === 'Y') {
    text = 'Health';
  } else if (changeAddress === 'Y') {
    text = 'Address';
  }

  return text ? (
    <div className="limitations-row">
      <va-icon
        class="limitations-row__warning-icon"
        icon="warning"
        size={3}
        srtext="warning"
      />
      {text}
    </div>
  ) : (
    'None'
  );
};

const createRelationshipCell = attributes => {
  if ('veteran' in attributes) {
    return attributes?.claimant.relationship;
  }
  return 'Veteran';
};

const POARequestsTable = ({ poaRequests }) => {
  return (
    <va-table data-testid="poa-requests-table" sort-column={1}>
      <va-table-row slot="headers">
        <span data-testid="poa-requests-table-headers-status">Status</span>
        <span data-testid="poa-requests-table-headers-name">
          Veteran or claimant
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
          <span data-testid={`poa-requests-table-${procId}-name`}>
            <Link to={`/poa-requests/${procId}`}>
              {`${attributes.claimant.lastName}, ${
                attributes.claimant.firstName
              }`}
            </Link>
            <span className="relationship-row">
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
