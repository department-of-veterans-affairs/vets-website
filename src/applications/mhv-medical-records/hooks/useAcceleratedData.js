import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
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
  const isAcceleratingVitalsEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVitalSignsEnabled
      ],
  );
  const isAcceleratingVaccinesEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVaccinesEnabled
      ],
  );

  const isAcceleratingCareNotesEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryCareNotesEnabled
      ],
  );

  const isAcceleratingLabsAndTestsEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled
      ],
  );
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

  const isAcceleratingCareNotes = useMemo(
    () => {
      return isAcceleratedDeliveryEnabled && isAcceleratingCareNotesEnabled;
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingCareNotesEnabled],
  );

  const isAcceleratingVitals = useMemo(
    () => {
      return (
        isAcceleratedDeliveryEnabled && isAcceleratingVitalsEnabled && isCerner
      );
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingVitalsEnabled, isCerner],
  );

  const isAcceleratingVaccines = useMemo(
    () => {
      return isAcceleratedDeliveryEnabled && isAcceleratingVaccinesEnabled;
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingVaccinesEnabled],
  );

  const isAcceleratingLabsAndTests = useMemo(
    () => {
      return isAcceleratedDeliveryEnabled && isAcceleratingLabsAndTestsEnabled;
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingLabsAndTestsEnabled],
  );
  const isAccelerating = useMemo(
    () =>
      isAcceleratedDeliveryEnabled ||
      isAcceleratingAllergies ||
      isAcceleratingCareNotes ||
      isAcceleratingVitals ||
      isAcceleratingVaccines ||
      isAcceleratingLabsAndTests,
    [
      isAcceleratedDeliveryEnabled,
      isAcceleratingAllergies,
      isAcceleratingCareNotes,
      isAcceleratingVitals,
      isAcceleratingVaccines,
      isAcceleratingLabsAndTests,
    ],
  );

  return {
    isLoading,
    isAccelerating,
    isAcceleratingAllergies,
    isAcceleratingCareNotes,
    isAcceleratingVitals,
    isAcceleratingVaccines,
    isAcceleratingLabsAndTests,
  };
};

export default useAcceleratedData;
