import React, { useEffect, useState } from 'react';
import { getPOARequestsByCodes } from '../../actions/poaRequests';
import { mockPOARequestsResponse } from '../../mocks/mockPOARequestsResponse';

const POARequestsTable = () => {
  const [poaRequests, setPOARequests] = useState(
    mockPOARequestsResponse.records,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getPOARequestsByCodes()
      .then(data => {
        setPOARequests(data.records);
      })
      .catch(responseError => {
        setError(responseError);
      })
      .then(() => {
        setIsLoading(false);
      });
  }, []);

  const convertDate = date => {
    const [year, month, day] = date.split('-');
    return `${month}-${day}-${year}`;
  };

  if (isLoading) {
    return <va-loading-indicator message="Loading POA Requests..." />;
  }

  if (error) {
    return <p>There was an error loading the POA Requests</p>;
  }

  if (!poaRequests.length) {
    return <p>No POA Requests found</p>;
  }

  return (
    <va-table data-testid="poa-requests-table" sort-column={1}>
      <va-table-row slot="headers">
        <span data-testid="poa-requests-table-headers-status">Status</span>
        <span data-testid="poa-requests-table-headers-name">Name</span>
        <span data-testid="poa-requests-table-headers-limitations">
          Limitations
        </span>
        <span data-testid="poa-requests-table-headers-city">City</span>
        <span data-testid="poa-requests-table-headers-state">State</span>
        <span data-testid="poa-requests-table-headers-zip">Zip</span>
        <span data-testid="poa-requests-table-headers-received">Received</span>
      </va-table-row>
      {poaRequests.map(({ procId, attributes }) => (
        <va-table-row key={procId}>
          <span data-testid={`poa-requests-table-${procId}-status`}>
            {attributes.secondaryStatus}
          </span>
          <span data-testid={`poa-requests-table-${procId}-name`}>
            {`${attributes.claimant.lastName}, ${
              attributes.claimant.firstName
            }`}
          </span>
          <span data-testid={`poa-requests-table-${procId}-limitations`} />
          <span data-testid={`poa-requests-table-${procId}-city`}>
            {attributes.claimant.city}
          </span>
          <span data-testid={`poa-requests-table-${procId}-state`}>
            {attributes.claimant.state}
          </span>
          <span data-testid={`poa-requests-table-${procId}-zip`}>
            {attributes.claimant.zip}
          </span>
          <span data-testid={`poa-requests-table-${procId}-received`}>
            {convertDate(attributes.dateRequestReceived)}
          </span>
        </va-table-row>
      ))}
    </va-table>
  );
};

export default POARequestsTable;
