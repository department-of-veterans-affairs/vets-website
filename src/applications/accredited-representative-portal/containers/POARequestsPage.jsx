import PropTypes from 'prop-types';
import React from 'react';

import POARequestsTableFetcher from '../components/POARequestsTableFetcher/POARequestsTableFetcher';

const POARequestsPage = ({
  tableFetcherComponent: TableFetcherComponent = POARequestsTableFetcher,
}) => {
  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <TableFetcherComponent />
    </>
  );
};

POARequestsPage.propTypes = {
  tableFetcherComponent: PropTypes.elementType,
};

export default POARequestsPage;
