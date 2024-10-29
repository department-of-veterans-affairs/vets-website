import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import { connectDrupalSourceOfTruthCerner } from '~/platform/utilities/cerner/dsot';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useEffect } from 'react';

const useAcceleratedData = () => {
  const dispatch = useDispatch();
  const isAcceleratingAllergiesEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled
      ],
  );
  const isAcceleratingVitalsEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVitalsEnabled
      ],
  );

  useEffect(
    () => {
      // use Drupal based Cerner facility data
      connectDrupalSourceOfTruthCerner(dispatch);
    },
    [dispatch],
  );

  const isCerner = useSelector(selectIsCernerPatient);
  const isAcceleratingAllergies = useMemo(
    () => {
      return isAcceleratingAllergiesEnabled && isCerner;
    },
    [isAcceleratingAllergiesEnabled, isCerner],
  );

  const isAcceleratingVitals = useMemo(
    () => {
      return isAcceleratingVitalsEnabled && isCerner;
    },
    [isAcceleratingVitalsEnabled, isCerner],
  );

  return {
    isAcceleratingAllergies,
    isAcceleratingVitals,
  };
};

export default useAcceleratedData;
