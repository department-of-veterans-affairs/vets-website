import React from 'react';

import usePOARequests from '../../hooks/usePOARequests';
import POARequestsTable from '../POARequestsTable/POARequestsTable';
import ErrorMessage from '../common/ErrorMessage';

const POARequestsTableFetcher = () => {
  const { poaRequests, isLoading, error } = usePOARequests();

  if (isLoading)
    return <va-loading-indicator message="Loading POA Requests..." />;
  if (error) return <ErrorMessage />;
  if (!poaRequests || poaRequests.length === 0)
    return <p>No POA Requests found</p>;

  return <POARequestsTable poaRequests={poaRequests} />;
};

export default POARequestsTableFetcher;
