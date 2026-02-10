import { useState, useEffect } from 'react';

const mockData = [
  {
    prescriptionId: 1,
    prescriptionName: 'Pepcid 30mg tab',
    status: 'submitted',
    lastUpdated: '2026-01-26T04:00:00.000Z',
  },
  {
    prescriptionId: 2,
    prescriptionName: 'Zoloft 25mg',
    status: 'submitted',
    lastUpdated: '2026-01-26T04:00:00.000Z',
  },
  {
    prescriptionId: 3,
    prescriptionName: 'Lipitor 20mg',
    status: 'submitted',
    lastUpdated: '2026-02-01T04:00:00.000Z',
  },
  {
    prescriptionId: 4,
    prescriptionName: 'Tamiflu 75mg',
    status: 'in-progress',
    lastUpdated: '2026-01-29T04:00:00.000Z',
  },
  {
    prescriptionId: 5,
    prescriptionName: 'Benadryl 50mg',
    status: 'shipped',
    lastUpdated: '2026-01-21T04:00:00.000Z',
  },
  {
    prescriptionId: 6,
    prescriptionName: 'Zantac 150mg',
    status: 'shipped',
    lastUpdated: '2026-01-13T04:00:00.000Z',
  },
];

/**
 * Custom hook to fetch in-progress prescription data.
 * TODO - this currently uses mock data; replace with real API call
 *
 * @returns {Object} The prescription data, loading state, and error state
 */
export const useFetchPrescriptionsInProgress = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsApiError, setPrescriptionsApiError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setPrescriptionsApiError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // throw new Error('Test error'); // Uncomment to simulate an error
        setPrescriptions(mockData);
      } catch (error) {
        setPrescriptionsApiError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    prescriptions,
    prescriptionsApiError,
    isLoading,
  };
};

export default useFetchPrescriptionsInProgress;
