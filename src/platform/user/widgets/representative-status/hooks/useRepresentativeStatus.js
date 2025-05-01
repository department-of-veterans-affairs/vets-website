import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import RepresentativeStatusApi from '../api/RepresentativeStatusApi';
import { formatContactInfo } from '../utilities/formatContactInfo';

export function useRepresentativeStatus() {
  const [representative, setRepresentative] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const poaCookie = Cookies.get('powerOfAttorney');

  const transformResponse = async poaData => {
    const {
      concatAddress,
      contact,
      extension,
      vcfUrl,
    } = await formatContactInfo(poaData.attributes);

    setRepresentative({
      id: poaData.id,
      poaType: poaData.attributes.individualType || poaData.attributes.type,
      ...poaData.attributes,
      concatAddress,
      contact,
      extension,
      vcfUrl,
    });
  };

  useEffect(() => {
    const fetchRepStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await RepresentativeStatusApi.getRepresentativeStatus();

        if (response?.data?.id) {
          const poaData = response.data;
          transformResponse(poaData);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    /* 
      In the Profile instantiation of this tool, we call the POA endpoint
      to conditionally display text outside of the widget. To prevent a
      redundant network request, success responses are stored in a cookie.
    */
    if (poaCookie) {
      setIsLoading(false);
      setError(null);
      transformResponse(poaCookie);
    } else {
      fetchRepStatus();
    }
  }, []);

  return { representative, isLoading, error };
}
