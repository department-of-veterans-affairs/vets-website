import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import { connectDrupalSourceOfTruthCerner } from '~/platform/utilities/cerner/dsot';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useEffect } from 'react';

const useAcceleratedData = () => {
  const dispatch = useDispatch();

  const isAcceleratedDeliveryEnabled = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled],
  );
  const isAcceleratingAllergiesEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled
      ],
  );
  const isAcceleratingVitalsEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVitalSignsEnabled
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

  const { featureToggles, drupalStaticData } = useSelector(state => state);
  const isLoading = useMemo(
    () => {
      return featureToggles.loading || drupalStaticData?.vamcEhrData?.loading;
    },
    [drupalStaticData, featureToggles],
  );

  const isAcceleratingAllergies = useMemo(
    () => {
      return (
        isAcceleratedDeliveryEnabled &&
        isAcceleratingAllergiesEnabled &&
        isCerner
      );
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingAllergiesEnabled, isCerner],
  );

  const isAcceleratingVitals = useMemo(
    () => {
      return (
        isAcceleratedDeliveryEnabled && isAcceleratingVitalsEnabled && isCerner
      );
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingVitalsEnabled, isCerner],
  );

  return {
    isLoading,
    isAcceleratingAllergies,
    isAcceleratingVitals,
  };
};

export default useAcceleratedData;
