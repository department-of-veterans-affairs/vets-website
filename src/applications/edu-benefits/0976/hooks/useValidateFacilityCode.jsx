import { useEffect, useState } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import _ from 'lodash';
import { getAtPath, setAtPath, institutionResponseToObject } from '../helpers';

export const useValidateFacilityCode = (formData, dataPath) => {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();

  const institutionData = getAtPath(formData, dataPath);
  const facilityCode = institutionData?.facilityCode;

  const updateFormData = value => {
    const data = _.cloneDeep(formData);
    const currentDetails = getAtPath(formData, dataPath);
    setAtPath(data, dataPath, {
      ...currentDetails,
      ...value,
    });
    dispatch(setData(data));
  };

  useEffect(() => {
    const fetchInstitutionInfo = async () => {
      setLoading(true);
      setHasError(false);

      try {
        const response = await apiRequest(`/gi/institutions/${facilityCode}`);

        // with a successful response, we set the institution data
        // at the correct place in the formData
        updateFormData({
          ...institutionResponseToObject(response.data),
          failedToLoad: false,
        });
      } catch (error) {
        setHasError(true);
        updateFormData({ name: '', failedToLoad: true });
      } finally {
        setLoading(false);
      }
    };
    if (facilityCode?.length === 8) {
      fetchInstitutionInfo();
    } else {
      setHasError(false);
      updateFormData({ name: '', failedToLoad: false });
    }
  }, [facilityCode]);

  return {
    loading,
    hasError,
  };
};
