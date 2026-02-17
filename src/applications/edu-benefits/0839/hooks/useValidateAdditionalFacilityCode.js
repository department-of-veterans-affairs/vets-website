import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';

export const useValidateAdditionalFacilityCode = (formData, index) => {
  const [loader, setLoader] = useState(false);
  const [institutionData, setInstitutionData] = useState(null);
  const dispatch = useDispatch();

  // Get the current item from the additionalInstitutionDetails array
  const currentItem = formData?.additionalInstitutionDetails?.[index] || {};
  const facilityCode = currentItem?.facilityCode;

  useEffect(() => {
    const fetchInstitutionInfo = async () => {
      setLoader(true);

      const updatedDetailsLoading = [
        ...(formData.additionalInstitutionDetails || []),
      ];
      updatedDetailsLoading[index] = {
        ...updatedDetailsLoading[index],
        isLoading: true,
      };

      dispatch(
        setData({
          ...formData,
          additionalInstitutionDetails: updatedDetailsLoading,
        }),
      );

      try {
        const response = await apiRequest(`/gi/institutions/${facilityCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const attrs = response.data.attributes;
        const isForeignCountry =
          response.data?.attributes?.type?.toLowerCase() === 'foreign';
        const firstDigit = facilityCode.charAt(0);
        const secondDigit = facilityCode.charAt(1);
        const yrEligible =
          ['1', '2', '3'].includes(firstDigit) &&
          ['1', '2', '3', '4'].includes(secondDigit);

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

        const updatedDetails = [
          ...(formData.additionalInstitutionDetails || []),
        ];
        updatedDetails[index] = {
          ...updatedDetails[index],
          institutionName: response?.data?.attributes?.name,
          institutionAddress,
          yrEligible,
          isLoading: false,
          isForeignCountry,
        };

        dispatch(
          setData({
            ...formData,
            additionalInstitutionDetails: updatedDetails,
          }),
        );
      } catch (error) {
        setInstitutionData({});
        setLoader(false);

        const updatedDetails = [
          ...(formData.additionalInstitutionDetails || []),
        ];
        updatedDetails[index] = {
          ...updatedDetails[index],
          institutionName: 'not found',
          institutionAddress: {},
          isLoading: false,
          yrEligible: false,
          isForeignCountry: false,
        };

        dispatch(
          setData({
            ...formData,
            additionalInstitutionDetails: updatedDetails,
          }),
        );
      }
    };
    if (facilityCode?.length === 8 && index !== undefined) {
      fetchInstitutionInfo();
    }
  }, [facilityCode, index]);

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
