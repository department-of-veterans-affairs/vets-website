import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const POARequestsWidget = ({ poaRequests }) => (
  <div className="vads-u-background-color--white vads-u-padding--2p5 rounded-corners">
    <Link
      className="view-all-link vads-u-margin-bottom--neg4"
      data-testid="view-all-poa-requests-link"
      to="/poa-requests"
    >
      View all
    </Link>
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
              <Link to={`/poa-requests/${request.id}`}>{request.name}</Link>
            </span>
            <span>{request.date}</span>
            <span />
          </va-table-row>
        );
      })}
    </va-table>
  </div>
);

POARequestsWidget.propTypes = {
  poaRequests: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
      date: PropTypes.string,
    }),
  ).isRequired,
};

export default POARequestsWidget;
