import { useState, useEffect } from 'react';
import { getPOARequestsByCodes } from '../actions/poaRequests';
import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';

const usePOARequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [poaRequests, setPOARequests] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchPOARequests = async () => {
      try {
        const response = await getPOARequestsByCodes('A1Q');
        setPOARequests(response.data);
      } catch (responseError) {
        setError(responseError);
      } finally {
        // TODO: Remove this mock poaRequests once the API is implemented
        setError(null);
        setPOARequests(mockPOARequestsResponse.data);

        setIsLoading(false);
      }
    };

    fetchPOARequests();
  }, []);

  return { isLoading, error, poaRequests };
};

export default usePOARequests;
