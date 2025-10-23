import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { selectFeatureToggles } from '../utils/selectors';

export const useDefaultFormData = () => {
  const { data: formData } = useSelector(state => state.form);
  const featureToggles = useSelector(selectFeatureToggles);
  const dispatch = useDispatch();

  const { useFacilitiesApi } = featureToggles;

  const setFormData = dataToSet => dispatch(setData(dataToSet));

  useEffect(
    () => {
      const defaultViewFields = {
        'view:useFacilitiesAPI': useFacilitiesApi,
      };

      setFormData({
        ...formData,
        ...defaultViewFields,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useFacilitiesApi],
  );
};
