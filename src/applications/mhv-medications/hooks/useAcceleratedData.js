import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useEffect } from 'react';

import { connectDrupalSourceOfTruthCerner } from '~/platform/utilities/cerner/dsot';

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

  // TODO: This might just be needed for the `isCerner` check, which has been removed for this version
  useEffect(
    () => {
      // TECH DEBT: Do not trigger the connection when running unit tests because
      // the connection is not mocked and will cause the test to fail
      if (!window.Mocha) {
        // use Drupal based Cerner facility data
        connectDrupalSourceOfTruthCerner(dispatch);
      }
    },
    [dispatch],
  );

  // TODO: isLoading is not being used in this app due to the loader setup in the routes, so might not be necessary
  const { featureToggles, drupalStaticData } = useSelector(state => state);
  const isLoading = useMemo(
    () => {
      return featureToggles.loading || drupalStaticData?.vamcEhrData?.loading;
    },
    [drupalStaticData, featureToggles],
  );

  const isAcceleratingAllergies = useMemo(
    () => {
      return isAcceleratedDeliveryEnabled && isAcceleratingAllergiesEnabled;
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingAllergiesEnabled],
  );

  return {
    isLoading,
    isAcceleratingAllergies,
  };
};

export default useAcceleratedData;
