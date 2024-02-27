import PropTypes from 'prop-types';
import React from 'react';

import { acceptPOARequest, declinePOARequest } from '../../actions/poaRequests';

const PoaRequestsTable = ({ poaRequests }) => {
  const isActionable = status => status === 'Pending';
  return (
    <va-table data-testid="poa-requests-table" sort-column={1}>
      <va-table-row slot="headers">
        <span>Claimant</span>
        <span>Submitted</span>
        <span>Description</span>
        <span>Status</span>
        <span>Actions</span>
      </va-table-row>
      {poaRequests.map(({ id, name, date, description, status }) => (
        <va-table-row key={id}>
          <span data-testid={`${id}-claimant`}>{name}</span>
          <span data-testid={`${id}-submitted`}>{date}</span>
          <span data-testid={`${id}-description`}>{description}</span>
          <span data-testid={`${id}-status`}>{status}</span>
          <span>
            {isActionable(status) && (
              <>
                <va-button
                  data-testid={`${id}-accept-button`}
                  secondary
                  text="Accept"
                  onClick={() => acceptPOARequest(id)}
                />
                <va-button
                  data-testid={`${id}-decline-button`}
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

PoaRequestsTable.propTypes = {
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

export default PoaRequestsTable;
