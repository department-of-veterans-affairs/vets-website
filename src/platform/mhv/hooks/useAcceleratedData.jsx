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
  const isAcceleratingCareNotesEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryCareNotesEnabled
      ],
  );
  const isAcceleratingConditionsEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryConditionsEnabled
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

  const isAcceleratingLabsAndTestsEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled
      ],
  );

  const isAcceleratingMedicationsEnabled = useSelector(
    state => state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot],
  );

  const isAcceleratingSecureMessagingEnabled = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot],
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
      return (
        isAcceleratedDeliveryEnabled &&
        isAcceleratingCareNotesEnabled &&
        isCerner
      );
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingCareNotesEnabled, isCerner],
  );

  const isAcceleratingConditions = useMemo(
    () => {
      return (
        isAcceleratedDeliveryEnabled &&
        isAcceleratingConditionsEnabled &&
        isCerner
      );
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingConditionsEnabled, isCerner],
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
      return (
        isAcceleratedDeliveryEnabled &&
        isAcceleratingVaccinesEnabled &&
        isCerner
      );
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingVaccinesEnabled, isCerner],
  );

  const isAcceleratingLabsAndTests = useMemo(
    () => {
      return (
        isAcceleratedDeliveryEnabled &&
        isAcceleratingLabsAndTestsEnabled &&
        isCerner
      );
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingLabsAndTestsEnabled, isCerner],
  );

  const isAcceleratingMedications = useMemo(
    () => {
      return (
        isAcceleratedDeliveryEnabled &&
        isAcceleratingMedicationsEnabled &&
        isCerner
      );
    },
    [isAcceleratedDeliveryEnabled, isAcceleratingMedicationsEnabled, isCerner],
  );

  const isAcceleratingSecureMessaging = useMemo(
    () => {
      return (
        isAcceleratedDeliveryEnabled &&
        isAcceleratingSecureMessagingEnabled &&
        isCerner
      );
    },
    [
      isAcceleratedDeliveryEnabled,
      isAcceleratingSecureMessagingEnabled,
      isCerner,
    ],
  );

  const isAccelerating = useMemo(
    () =>
      isAcceleratedDeliveryEnabled ||
      isAcceleratingAllergies ||
      isAcceleratingCareNotes ||
      isAcceleratingConditions ||
      isAcceleratingVitals ||
      isAcceleratingVaccines ||
      isAcceleratingLabsAndTests ||
      isAcceleratingMedications ||
      isAcceleratingSecureMessaging,
    [
      isAcceleratedDeliveryEnabled,
      isAcceleratingAllergies,
      isAcceleratingConditions,
      isAcceleratingCareNotes,
      isAcceleratingVitals,
      isAcceleratingVaccines,
      isAcceleratingLabsAndTests,
      isAcceleratingMedications,
      isAcceleratingSecureMessaging,
    ],
  );

  return {
    isLoading,
    isCerner,
    isAccelerating,
    isAcceleratingAllergies,
    isAcceleratingCareNotes,
    isAcceleratingConditions,
    isAcceleratingVitals,
    isAcceleratingVaccines,
    isAcceleratingLabsAndTests,
    isAcceleratingMedications,
    isAcceleratingSecureMessaging,
  };
};

export default useAcceleratedData;
