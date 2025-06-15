import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { selectAuthStatus } from '../utilities/selectors/authStatus';
import { selectFeatureToggles } from '../utilities/selectors/featureToggles';

/**
 * NOTE: `veteranFullName` is included in the dependency list to reset view fields when
 * starting a new application from save-in-progress.
 */
export const useDefaultFormData = () => {
  const { data: formData } = useSelector(state => state.form);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isLoggedIn, isUserLOA3 } = useSelector(selectAuthStatus);
  const dispatch = useDispatch();

  const { veteranFullName } = formData;
  const { v2IsEnabled } = featureToggles;

  const setFormData = dataToSet => dispatch(setData(dataToSet));

  useEffect(
    () => {
      const defaultViewFields = {
        'view:isLoggedIn': isLoggedIn,
        'view:isUserLOA3': isUserLOA3,
        'view:v2IsEnabled': v2IsEnabled,
      };

      setFormData({
        ...formData,
        ...defaultViewFields,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoggedIn, veteranFullName, isUserLOA3, v2IsEnabled],
  );
};
