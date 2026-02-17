import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';
import { isPOEEligible } from '../helpers';

export const useValidateFacilityCode = formData => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const facilityCode = formData?.institutionDetails?.facilityCode?.trim();

  useEffect(() => {
    const fetchInstitutionInfo = async () => {
      setLoader(true);
      try {
        const response = await apiRequest(`/gi/institutions/${facilityCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const attrs = response.data.attributes;

        const institutionAddress = {
          street: attrs.address1 || '',
          street2: attrs.address2 || '',
          street3: attrs.address3 || '',
          city: attrs.city || '',
          state: attrs.state || '',
          postalCode: attrs.zip || '',
          country: attrs.country || '',
        };

        dispatch(
          setData({
            ...formData,
            institutionDetails: {
              ...formData.institutionDetails,
              institutionName: response?.data?.attributes?.name,
              institutionAddress,
              poeEligible: isPOEEligible(facilityCode),
            },
          }),
        );
      } catch (error) {
        dispatch(
          setData({
            ...formData,
            institutionDetails: {
              ...formData.institutionDetails,
              institutionName: 'not found',
              institutionAddress: {},
              poeEligible: undefined,
            },
          }),
        );
      } finally {
        setLoader(false);
      }
    };

    if (facilityCode?.length === 8) {
      fetchInstitutionInfo();
    }
  }, [facilityCode]);

  return { loader };
};
