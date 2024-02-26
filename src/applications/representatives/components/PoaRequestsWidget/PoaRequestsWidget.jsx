import React from 'react';
import PropTypes from 'prop-types';

const PoaRequestsWidget = ({ poaRequests }) => (
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
        <span>Accept/ decline</span>
      </va-table-row>
      {poaRequests.map(request => {
        return (
          <va-table-row key={request.id}>
            <span>
              <va-link
                href={`/poa-requests/${request.id}`}
                text={request.name}
              />
            </span>
            <span>{request.date}</span>
            <span />
          </va-table-row>
        );
      })}
    </va-table>
  </div>
);

PoaRequestsWidget.propTypes = {
  poaRequests: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
      date: PropTypes.string,
    }),
  ).isRequired,
};

export default PoaRequestsWidget;
