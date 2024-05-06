import { useState, useEffect } from 'react';
import { getPOARequestsByCodes } from '../actions/poaRequests';
import { mockPOARequests } from '../mocks/mockPOARequests';

const usePOARequests = () => {
  const [poaRequests, setPOARequests] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchPOARequests = async () => {
      try {
        const response = await getPOARequestsByCodes('A1Q');
        setPOARequests(response.records);
      } catch (responseError) {
        setError(responseError);
      } finally {
        // TODO: Remove this mock poaRequests once the API is implemented
        setError(null);
        setPOARequests(mockPOARequests);

        setIsLoading(false);
      }
    };

    fetchPOARequests();
  }, []);

  return { poaRequests, isLoading, error };
};

export default usePOARequests;
