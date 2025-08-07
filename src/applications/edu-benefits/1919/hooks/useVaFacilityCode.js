import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setData } from 'platform/forms-system/src/js/actions';
import { apiRequest } from 'platform/utilities/api';

export const useVaFacilityCode = () => {
  const formData = useSelector(state => state.form?.data);
  const dispatch = useDispatch();
  useEffect(
    () => {
      const fetchInstitutionName = async () => {
        dispatch(
          setData({
            ...formData,
            institutionDetails: {
              ...formData.institutionDetails,
              institutionName: '',
              loader: true,
            },
          }),
        );
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
          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName: response?.data?.attributes?.name,
                institutionAddress: {
                  street: response?.data?.attributes?.address1,
                  street2: response?.data?.attributes?.address2,
                  street3: response?.data?.attributes?.address3,
                  city: response?.data?.attributes?.city,
                  state: response?.data?.attributes?.state,
                  postalCode: response?.data?.attributes?.zip,
                  country: response?.data?.attributes?.country,
                },
                loader: false,
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
                institutionAddress: {
                  street: '',
                  street2: '',
                  street3: '',
                  city: '',
                  state: '',
                  postalCode: '',
                  country: '',
                },
                loader: false,
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
  return null;
};
