import PropTypes from 'prop-types';
import React from 'react';

import POARequestsTable from '../POARequestsTable/POARequestsTable';
import ErrorMessage from '../common/ErrorMessage';

const POARequestsTableFetcher = ({ usePOARequests }) => {
  const { isLoading, error, poaRequests } = usePOARequests();

  if (isLoading)
    return (
      <va-loading-indicator
        data-testid="poa-requests-table-fetcher-loading"
        message="Loading POA requests..."
      />
    );
  if (error) return <ErrorMessage />;
  if (!poaRequests || poaRequests.length === 0)
    return (
      <p data-testid="poa-requests-table-fetcher-no-poa-requests">
        No POA requests found
      </p>
    );

  return <POARequestsTable poaRequests={poaRequests} />;
};

POARequestsTableFetcher.propTypes = {
  usePOARequests: PropTypes.func.isRequired,
};

export default POARequestsTableFetcher;
