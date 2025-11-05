import React from 'react';
import PropTypes from 'prop-types';
import POARequestCard from './POARequestCard';

const POARequestSearchPageResults = ({ poaRequests }) => {
  if (poaRequests.length === 0) {
    return (
      <p data-testid="representation-requests-table-fetcher-no-poa-requests">
        No representation requests found.
      </p>
    );
  }

  return (
    <ul
      data-testid="representation-requests-card"
      className="poa-request__list"
      sort-column={1}
    >
      {poaRequests.map((request, index) => {
        return <POARequestCard poaRequest={request} key={index} />;
      })}
    </ul>
  );
};

POARequestSearchPageResults.propTypes = {
  poaRequests: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number,
      map: PropTypes.func,
    }),
  ),
};

export default POARequestSearchPageResults;
