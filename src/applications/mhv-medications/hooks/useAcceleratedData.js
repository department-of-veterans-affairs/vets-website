import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const useAcceleratedData = () => {
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

  const isAcceleratingAllergies = useMemo(
    () => {
      return isAcceleratedDeliveryEnabled && isAcceleratingAllergiesEnabled;
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingAllergiesEnabled],
  );

  return {
    isAcceleratingAllergies,
  };
};

export default useAcceleratedData;
