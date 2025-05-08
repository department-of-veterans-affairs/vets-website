import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';

export const useValidateFacilityCode = formData => {
  const [loader, setLoader] = useState(false);
  const [institutionData, setInstitutionData] = useState(null);
  const dispatch = useDispatch();

  useEffect(
    () => {
      const fetchInstitutionName = async () => {
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
          setInstitutionData(response?.data);
          setLoader(false);
          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName: response?.data?.attributes?.name,
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
              },
            }),
          );
        }
      };
      if (formData?.institutionDetails?.facilityCode?.length === 8) {
        fetchInstitutionName();
      }
    },
    [formData?.institutionDetails?.facilityCode],
  );
  return {
    loader,
    institutionName: institutionData?.attributes?.name || 'not found',
    ...institutionData,
  };
};
