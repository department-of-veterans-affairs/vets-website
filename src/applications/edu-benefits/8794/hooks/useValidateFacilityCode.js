import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';

export const useValidateFacilityCode = formData => {
  const [loader, setLoader] = useState(false);
  const [institutionData, setInstitutionData] = useState(null);
  const dispatch = useDispatch();

  useEffect(
    () => {
      const fetchInstitutionInfo = async () => {
        setLoader(true);
        try {
          const response = await apiRequest(
            `/gi/institutions/${formData?.institutionDetails.facilityCode}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          const attrs = response.data.attributes;
          const address = {
            address1: attrs.address1 || '',
            address2: attrs.address2 || '',
            address3: attrs.address3 || '',
            city: attrs.city || '',
            state: attrs.state || '',
            zip: attrs.zip || '',
            country: attrs.country || '',
          };

          setInstitutionData(response?.data);
          setLoader(false);
          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName: response?.data?.attributes?.name,
                address,
              },
            }),
          );
        } catch (error) {
          setInstitutionData({});
          setLoader(false);
          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName: 'not found',
                address: {},
              },
            }),
          );
        }
      };
      if (formData?.institutionDetails?.facilityCode?.length === 8) {
        fetchInstitutionInfo();
      }
    },
    [formData?.institutionDetails?.facilityCode],
  );
  const attrs = institutionData?.attributes || {};
  const address = {
    address1: attrs.address1 || '',
    address2: attrs.address2 || '',
    address3: attrs.address3 || '',
    city: attrs.city || '',
    state: attrs.state || '',
    zip: attrs.zip || '',
    country: attrs.country || '',
  };

  return {
    loader,
    address,
    institutionName: institutionData?.attributes?.name || 'not found',
    ...institutionData,
  };
};
