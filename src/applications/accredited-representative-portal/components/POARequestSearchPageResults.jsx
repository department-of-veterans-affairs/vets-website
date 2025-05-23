import React from 'react';
import PropTypes from 'prop-types';
import POARequestCard from './POARequestCard';

const POARequestSearchPageResults = ({ poaRequests }) => {
  if (poaRequests.length === 0) {
    return (
      <p data-testid="poa-requests-table-fetcher-no-poa-requests">
        No POA requests found
      </p>
    );
  }

  return (
    <ul
      data-testid="poa-requests-card"
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
