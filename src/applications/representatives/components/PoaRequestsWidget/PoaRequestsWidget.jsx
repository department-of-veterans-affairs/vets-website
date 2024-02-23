import PropTypes from 'prop-types';
import React from 'react';

const PoaRequestsWidget = ({ poaRequests }) => {
  return (
    <div className="vads-u-background-color--white vads-u-padding--2p5 rounded-corners">
      <va-link
        class="view-all-link vads-u-margin-bottom--neg4"
        href="/representatives/poa-requests"
        text="View all"
      />
      <va-table sort-column={1} table-title="POA requests">
        <va-table-row slot="headers">
          <span>Claimant</span>
          <span>Submitted</span>
        </va-table-row>
        {poaRequests.map(request => (
          <va-table-row key={request.id}>
            <span>
              <va-link
                href={`/poa-requests/${request.id}`}
                text={request.name}
              />
            </span>
            <span>{request.date}</span>
          </va-table-row>
        ))}
      </va-table>
    </div>
  );
};

PoaRequestsWidget.propTypes = {
  poaRequests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      date: PropTypes.string,
    }),
  ).isRequired,
};

export default PoaRequestsWidget;
