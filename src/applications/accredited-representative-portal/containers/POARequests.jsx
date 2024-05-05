import React, { useEffect, useState } from 'react';

import { getPOARequestsByCodes } from '../actions/poaRequests';
import POARequestsTable from '../components/POARequestsTable/POARequestsTable';
import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';

const POARequests = () => {
  const [poaRequests, setPOARequests] = useState(
    mockPOARequestsResponse.records,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  let content = null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPOARequestsByCodes('A1Q');
        setPOARequests(data.records);
        setError(null);
      } catch (responseError) {
        setError(responseError);
      } finally {
        // TODO: Get 200 from request, remove mock data, then remove the line below
        setError(null);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    content = <va-loading-indicator message="Loading POA Requests..." />;
  } else if (error) {
    content = (
      <va-alert status="error" visible>
        <h2 slot="headline">We’re sorry. Something went wrong.</h2>
        <div>
          <p className="vads-u-margin-y--0">
            Please refresh this page or check back later. You can also check the
            system status on the VA.gov homepage.
          </p>
        </div>
      </va-alert>
    );
  } else if (!poaRequests?.length) {
    content = <p>No POA Requests found</p>;
  } else {
    content = <POARequestsTable poaRequests={poaRequests} />;
  }

  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <va-alert status="info" visible>
        <h2 slot="headline">
          Veterans can now digitally submit form 21-22 from VA.gov
        </h2>
        <div>
          <p className="vads-u-margin-y--0">
            Veterans can now find a VSO and sign and submit a digital version of
            form 21-22. Digital submissions will immediately populate in the
            table below.
          </p>
        </div>
      </va-alert>
      <h2 data-testid="poa-requests-table-heading">Requests</h2>
      {content}
    </>
  );
};

export default POARequests;
