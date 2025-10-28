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
        // Set loading state in formData
        dispatch(
          setData({
            ...formData,
            institutionDetails: {
              ...formData.institutionDetails,
              isLoading: true,
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
          const attrs = response.data.attributes;
          const firstDigit = formData.institutionDetails.facilityCode.charAt(0);
          const secondDigit = formData.institutionDetails.facilityCode.charAt(
            1,
          );
          const yrEligible =
            ['1', '2', '3'].includes(firstDigit) &&
            ['1', '2', '3', '4'].includes(secondDigit);

          const programTypes = Array.isArray(attrs.programTypes)
            ? attrs.programTypes
            : [];
          const ihlEligible = programTypes.includes('IHL');
          const institutionAddress = {
            street: attrs.address1 || '',
            street2: attrs.address2 || '',
            street3: attrs.address3 || '',
            city: attrs.city || '',
            state: attrs.state || '',
            postalCode: attrs.zip || '',
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
                institutionAddress,
                ihlEligible,
                yrEligible,
                isLoading: false,
                isUsaSchool:
                  response?.data?.attributes?.physicalCountry === 'USA',
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
                institutionAddress: {},
                ihlEligible: null,
                isLoading: false,
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
  const institutionAddress = {
    street: attrs.address1 || '',
    street2: attrs.address2 || '',
    street3: attrs.address3 || '',
    city: attrs.city || '',
    state: attrs.state || '',
    postalCode: attrs.zip || '',
    country: attrs.country || '',
  };

  return {
    loader,
    institutionAddress,
    institutionName: institutionData?.attributes?.name || 'not found',
    ...institutionData,
  };
};
