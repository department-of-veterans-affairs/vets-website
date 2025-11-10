import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';

export const useValidateFacilityCode = formData => {
  const [loader, setLoader] = useState(false);
  const [institutionData, setInstitutionData] = useState(null);
  // const [lastFetchedCode, setLastFetchedCode] = useState(null);
  const dispatch = useDispatch();

  const facilityCode = formData?.institutionDetails?.facilityCode;

  // const rawFacilityCode = formData?.institutionDetails?.facilityCode;
  // const facilityCode =
  //   typeof rawFacilityCode === 'string'
  //     ? rawFacilityCode.trim()
  //     : rawFacilityCode?.toString()?.trim() || '';

  useEffect(
    () => {
      const fetchInstitutionInfo = async () => {
        setLoader(true);

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
          const isForeignCountry =
            response.data?.attributes?.type?.toLowerCase() === 'foreign';
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
          const facilityMap = attrs.facilityMap.main;

          setInstitutionData(response?.data);
          setLoader(false);

          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName: response?.data?.attributes?.name,
                institutionAddress,
                facilityMap,
                ihlEligible,
                yrEligible,
                isLoading: false,
                isUsaSchool:
                  response?.data?.attributes?.physicalCountry === 'USA',
                isForeignCountry,
              },
              additionalInstitutionDetails: [],
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
              additionalInstitutionDetails: [],
            }),
          );
        }
      };
      if (facilityCode?.length === 8) {
        fetchInstitutionInfo();
      }
      // if (facilityCode?.length === 8 && facilityCode !== lastFetchedCode) {
      //   console.log({ facilityCode, lastFetchedCode });
      //   setLastFetchedCode(facilityCode);
      //   fetchInstitutionInfo();
      // }
    },
    [facilityCode, formData, dispatch],
    // [facilityCode, formData, dispatch, lastFetchedCode],
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
