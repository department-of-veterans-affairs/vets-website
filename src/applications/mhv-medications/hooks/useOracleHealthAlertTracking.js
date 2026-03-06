import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { CernerAlertContent } from '~/platform/mhv/components/CernerFacilityAlert/constants';
import { selectMhvMedicationsOracleHealthCutoverFlag } from '../util/selectors';
import { selectOracleHealthMigrations } from '../selectors/selectUser';

/**
 * Custom hook for page-level Oracle Health EHR transition alert tracking.
 * Fires warning (T45) and error (T3) Datadog RUM events when migrations
 * are in the corresponding phases for CernerFacilityAlert rendering.
 *
 * Per-card and per-click events are handled directly
 * in their individual components, not in this hook.
 *
 * @param {Object} options - Tracking configuration
 * @param {string} options.warningActionName - Datadog action name for T45 warning alerts
 * @param {string} options.errorActionName - Datadog action name for T3 error alerts
 */
const useOracleHealthAlertTracking = ({
  warningActionName,
  errorActionName,
}) => {
  const migratingFacilities = useSelector(selectOracleHealthMigrations);
  const isOracleHealthCutoverEnabled = useSelector(
    selectMhvMedicationsOracleHealthCutoverFlag,
  );

  const config = CernerAlertContent.MEDICATIONS;

  // T45: Track when the OH EHR warning alert is displayed
  // Not gated by the cutover flag — T45 warnings fire regardless
  useEffect(
    () => {
      if (warningActionName && migratingFacilities?.length) {
        const warningMigrations = migratingFacilities.filter(migration =>
          config.warningPhases.includes(migration.phases?.current),
        );
        if (warningMigrations.length > 0) {
          const facilityIds = warningMigrations.flatMap(
            migration =>
              migration.facilities?.map(f => String(f.facilityId)) || [],
          );
          datadogRum.addAction(warningActionName, {
            facilityId: facilityIds,
            phase: warningMigrations[0].phases.current,
          });
        }
      }
    },
    [config.warningPhases, migratingFacilities, warningActionName],
  );

  // T3: Track when the OH EHR error alert is displayed
  useEffect(
    () => {
      if (
        errorActionName &&
        isOracleHealthCutoverEnabled &&
        migratingFacilities?.length
      ) {
        const errorMigrations = migratingFacilities.filter(migration =>
          config.errorPhases.includes(migration.phases?.current),
        );
        if (errorMigrations.length > 0) {
          const facilityIds = errorMigrations.flatMap(
            migration =>
              migration.facilities?.map(f => String(f.facilityId)) || [],
          );
          datadogRum.addAction(errorActionName, {
            facilityId: facilityIds,
            phase: errorMigrations[0].phases.current,
          });
        }
      }
    },
    [
      config.errorPhases,
      errorActionName,
      isOracleHealthCutoverEnabled,
      migratingFacilities,
    ],
  );

  return { migratingFacilities, isOracleHealthCutoverEnabled };
};

export default useOracleHealthAlertTracking;
