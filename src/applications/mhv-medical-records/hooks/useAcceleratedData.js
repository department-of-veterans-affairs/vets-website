import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import { connectDrupalSourceOfTruthCerner } from '~/platform/utilities/cerner/dsot';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useEffect } from 'react';

const useAcceleratedData = () => {
  const dispatch = useDispatch();
  const useAcceleratedApi = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled
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
  const isAccelerating = useMemo(
    () => {
      return useAcceleratedApi && isCerner;
    },
    [useAcceleratedApi, isCerner],
  );
  return {
    isAccelerating,
  };
};

export default useAcceleratedData;
