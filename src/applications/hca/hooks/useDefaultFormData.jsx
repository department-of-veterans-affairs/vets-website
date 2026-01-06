import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import { selectAuthStatus, selectFeatureToggles } from '../utils/selectors';
import { validateDateOfBirth } from '../utils/validation';

/**
 * NOTE: `veteranFullName` is included in the dependency list to reset view fields when
 * starting a new application from save-in-progress.
 *
 * NOTE (2): `veteranDob` is included from profile for authenticated users to fix a bug
 * where some profiles do not contain a DOB value. In this case we need to ask the user
 * for that data for proper submission.
 */
export const useDefaultFormData = () => {
  const { totalRating } = useSelector(state => state.disabilityRating);
  const { data: formData } = useSelector(state => state.form);
  const featureToggles = useSelector(selectFeatureToggles);
  const { dob: veteranDob, userFullName } = useSelector(selectProfile);
  const { isLoggedIn } = useSelector(selectAuthStatus);
  const dispatch = useDispatch();

  const { veteranFullName } = formData;
  const { isRegOnlyEnabled } = featureToggles;

  const setFormData = dataToSet => dispatch(setData(dataToSet));

  useEffect(
    () => {
      const defaultViewFields = {
        'view:isLoggedIn': isLoggedIn,
        'view:isRegOnlyEnabled': isRegOnlyEnabled,
        'view:totalDisabilityRating': parseInt(totalRating, 10) || 0,
      };
      const userData = isLoggedIn
        ? {
            'view:veteranInformation': {
              veteranDateOfBirth: validateDateOfBirth(veteranDob),
              veteranFullName: userFullName,
            },
          }
        : {};

      setFormData({
        ...formData,
        ...userData,
        ...defaultViewFields,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isLoggedIn,
      veteranDob,
      userFullName,
      veteranFullName,
      isRegOnlyEnabled,
      totalRating,
    ],
  );
};
