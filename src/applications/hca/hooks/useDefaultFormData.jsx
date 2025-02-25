import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import { selectAuthStatus, selectFeatureToggles } from '../utils/selectors';
import { validateVeteranDob } from '../utils/validation';

/**
 * NOTE: `veteranFullName` is included in the dependency list to reset view fields when
 * starting a new application from save-in-progress.
 *
 * NOTE (2): `veteranDob` is included from profile for authenticated users to fix a bug
 * where some profiles do not contain a DOB value. In this case we need to ask the user
 * for that data for proper submission.
 */
export const useDefaultFormData = () => {
  const stateData = useSelector(state => ({
    formData: state.form.data,
    featureToggles: selectFeatureToggles(state),
    isLoggedIn: selectAuthStatus(state).isLoggedIn,
    totalRating: parseInt(state.disabilityRating.totalRating, 10) || 0,
    veteranDateOfBirth: validateVeteranDob(selectProfile(state).dob),
  }));
  const dispatch = useDispatch();

  const { veteranFullName } = stateData.formData;

  useEffect(
    () => {
      const { isLoggedIn, featureToggles, formData, totalRating } = stateData;
      const defaultViewFields = {
        'view:isLoggedIn': isLoggedIn,
        'view:totalDisabilityRating': totalRating,
        'view:isRegOnlyEnabled': featureToggles.isRegOnlyEnabled,
        'view:isInsuranceV2Enabled': featureToggles.isInsuranceV2Enabled,
      };
      const userData = isLoggedIn
        ? {
            'view:veteranInformation': {
              veteranDateOfBirth: stateData.veteranDateOfBirth,
            },
          }
        : {};

      dispatch(
        setData({
          ...formData,
          ...userData,
          ...defaultViewFields,
        }),
      );
    },
    [dispatch, stateData, veteranFullName],
  );
};
