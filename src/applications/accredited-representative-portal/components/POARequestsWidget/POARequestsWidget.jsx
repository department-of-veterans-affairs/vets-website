import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import {
  createRelationshipCell,
  formatDate,
} from '../POARequestsTable/POARequestsTable';

const POARequestsWidget = ({ poaRequests }) => (
  <div className="vads-u-background-color--white vads-u-padding--2p5 rounded-corners">
    <Link
      className="view-all-link vads-u-margin-bottom--neg4"
      data-testid="poa-requests-widget-view-all-link"
      to="/poa-requests"
    >
      View all
    </Link>
    <va-table
      data-testid="poa-requests-widget-table"
      sort-column={1}
      table-title="POA requests"
      descending
    >
      <va-table-row slot="headers">
        <span data-testid="poa-requests-widget-table-headers-name">
          Veteran/Claimant
        </span>
        <span data-testid="poa-requests-widget-table-headers-received">
          POA received date
        </span>
      </va-table-row>
      {poaRequests.map(({ procId, attributes }) => {
        return (
          <va-table-row key={procId}>
            <span>
              <Link
                data-testid={`poa-requests-widget-table-${procId}-name`}
                to={`/poa-requests/${procId}`}
              >
                {`${attributes.claimant.lastName}, ${
                  attributes.claimant.firstName
                }`}
              </Link>
              <span
                data-testid={`poa-requests-widget-table-${procId}-relationship`}
                className="relationship-row"
              >
                {createRelationshipCell(attributes)}
              </span>
            </span>
            <span data-testid={`poa-requests-widget-table-${procId}-received`}>
              {formatDate(attributes.dateRequestReceived)}
            </span>
          </va-table-row>
        );
      })}
    </va-table>
  </div>
);

POARequestsWidget.propTypes = {
  poaRequests: PropTypes.array.isRequired,
};

export default POARequestsWidget;
