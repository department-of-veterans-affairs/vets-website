import PropTypes from 'prop-types';
import React from 'react';

import { acceptPOARequest, declinePOARequest } from '../actions/poaRequests';

const isActionable = status => status === 'Pending';

const POARequestsTable = ({ poaRequests }) => {
  return (
    <va-table data-testid="poa-requests-table" sort-column={1}>
      <va-table-row slot="headers">
        <span data-testid="poa-requests-table-claimant-header">Claimant</span>
        <span data-testid="poa-requests-table-submitted-header">Submitted</span>
        <span data-testid="poa-requests-table-description-header">
          Description
        </span>
        <span data-testid="poa-requests-table-status-header">Status</span>
        <span data-testid="poa-requests-table-actions-header">Actions</span>
      </va-table-row>
      {poaRequests.map(({ id, name, date, description, status }) => (
        <va-table-row key={id}>
          <span data-testid={`poa-requests-table-${id}-claimant`}>{name}</span>
          <span data-testid={`poa-requests-table-${id}-submitted`}>{date}</span>
          <span data-testid={`poa-requests-table-${id}-description`}>
            {description}
          </span>
          <span data-testid={`poa-requests-table-${id}-status`}>{status}</span>
          <span>
            {isActionable(status) && (
              <>
                <va-button
                  data-testid={`poa-requests-table-${id}-accept-button`}
                  secondary
                  text="Accept"
                  onClick={() => acceptPOARequest(id)}
                />
                <va-button
                  data-testid={`poa-requests-table-${id}-decline-button`}
                  secondary
                  text="Decline"
                  onClick={() => declinePOARequest(id)}
                />
              </>
            )}
          </span>
        </va-table-row>
      ))}
    </va-table>
  );
};

POARequestsTable.propTypes = {
  poaRequests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      date: PropTypes.string,
      description: PropTypes.string,
      status: PropTypes.string,
    }),
  ).isRequired,
};

export default POARequestsTable;
