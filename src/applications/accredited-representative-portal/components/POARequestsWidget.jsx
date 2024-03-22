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
    <va-table
      data-testid="poa-requests-widget-table"
      sort-column={1}
      table-title="POA requests"
    >
      <va-table-row slot="headers">
        <span data-testid="poa-requests-widget-table-claimant-header">
          Claimant
        </span>
        <span data-testid="poa-requests-widget-table-submitted-header">
          Submitted
        </span>
        <span data-testid="poa-requests-widget-table-actions-header">
          Actions
        </span>
      </va-table-row>
      {poaRequests.map(({ id, name, date }) => {
        return (
          <va-table-row key={id}>
            <span>
              <Link
                data-testid={`poa-requests-widget-table-${id}-claimant`}
                to={`/poa-requests/${id}`}
              >
                {name}
              </Link>
            </span>
            <span data-testid={`poa-requests-widget-table-${id}-submitted`}>
              {date}
            </span>
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
