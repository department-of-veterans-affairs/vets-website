import { useState, useEffect } from 'react';
import RepresentativeStatusApi from '../api/RepresentativeStatusApi';
import { formatContactInfo } from '../utilities/formatContactInfo';

export function useRepresentativeStatus() {
  const [representative, setRepresentative] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await RepresentativeStatusApi.getRepresentativeStatus();

        if (response?.data?.id) {
          const poaData = response.data;

          const {
            concatAddress,
            contact,
            extension,
            vcfUrl,
          } = await formatContactInfo(poaData.attributes);

          setRepresentative({
            id: poaData.id,
            poaType: poaData.attributes.type,
            ...poaData.attributes,
            concatAddress,
            contact,
            extension,
            vcfUrl,
          });
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepStatus();
  }, []);

  return { representative, isLoading, error };
}
