import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';
import { datadogRum } from '@datadog/browser-rum';
import { CernerAlertContent } from '~/platform/mhv/components/CernerFacilityAlert/constants';
import { getPrescriptionDetailUrl } from '../../util/helpers';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { selectMhvMedicationsOracleHealthCutoverFlag } from '../../util/selectors';

/**
 * Component to render alerts for prescriptions blocked during Oracle Health transition
 * Shows error alert when prescriptions cannot be refilled during migration phases
 */
export const OracleHealthT3Alert = ({
  blockedPrescriptions,
  hasRefillable = true,
  migratingFacilities,
  className = '',
}) => {
  const config = CernerAlertContent.MEDICATIONS_REFILL;
  const isOracleHealthCutoverEnabled = useSelector(
    selectMhvMedicationsOracleHealthCutoverFlag,
  );

  const blockedFacilityIds = useMemo(
    () => [
      ...new Set(
        (blockedPrescriptions || [])
          .map(rx => String(rx.stationNumber))
          .filter(id => id != null && id !== 'undefined'),
      ),
    ],
    [blockedPrescriptions],
  );

  // Find migration schedule(s) that include the blocked prescription facilities
  const relevantMigration = useMemo(
    () =>
      migratingFacilities.find(migration =>
        migration.facilities?.some(f =>
          blockedFacilityIds.includes(String(f.facilityId)),
        ),
      ),
    [migratingFacilities, blockedFacilityIds],
  );

  // Track when the refill blocked alert is displayed
  useEffect(
    () => {
      if (
        isOracleHealthCutoverEnabled &&
        blockedFacilityIds.length &&
        relevantMigration?.phases
      ) {
        datadogRum.addAction(
          dataDogActionNames.oracleHealthTransition
            .T3_REFILL_BLOCKED_ALERT_DISPLAYED,
          {
            facilityId: blockedFacilityIds,
            phase: relevantMigration?.phases?.current,
            blockedPrescriptionCount: blockedPrescriptions.length,
          },
        );
      }
    },
    [
      isOracleHealthCutoverEnabled,
      blockedFacilityIds,
      relevantMigration,
      blockedPrescriptions,
    ],
  );

  // Don't render if feature flag is disabled
  if (!isOracleHealthCutoverEnabled) {
    return null;
  }

  // Don't render if no migration data or no blocked prescriptions
  if (!migratingFacilities?.length || !blockedPrescriptions?.length) {
    return null;
  }

  // Don't render if no matching migration found or no phases defined
  if (!relevantMigration?.phases) {
    return null;
  }

  const endDate = relevantMigration.phases[config.errorEndDate];
  const testId = hasRefillable
    ? 'oracle-health-t3-alert-with-refillable'
    : 'oracle-health-t3-alert-no-refillable';

  // Track clicks on blocked prescription links
  const handleBlockedRxLinkClick = prescription => {
    datadogRum.addAction(
      dataDogActionNames.oracleHealthTransition.T3_BLOCKED_RX_LINK_CLICK,
      {
        facilityId: prescription.stationNumber,
      },
    );
  };

  return (
    <va-alert
      class={`vads-u-margin-bottom--2p5 ${className}`}
      status="error"
      background-only
      data-testid={testId}
    >
      <h2 className="vads-u-font-size--md" slot="headline">
        {config.errorHeadline}
      </h2>
      <div>
        <p>
          You can’t refill these prescriptions online until{' '}
          <strong>{endDate}</strong>:
        </p>
        <ul>
          {blockedPrescriptions.map(prescription => (
            <li key={prescription.prescriptionId}>
              <Link
                to={getPrescriptionDetailUrl(prescription)}
                className="vads-u-text-decoration--underline"
                aria-label={`View details for ${prescription.prescriptionName}`}
                onClick={() => handleBlockedRxLinkClick(prescription)}
              >
                {prescription.prescriptionName}
              </Link>
            </li>
          ))}
        </ul>
        <p>{config.errorNote}</p>
      </div>
    </va-alert>
  );
};

OracleHealthT3Alert.propTypes = {
  blockedPrescriptions: PropTypes.arrayOf(
    PropTypes.shape({
      prescriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      prescriptionName: PropTypes.string,
      stationNumber: PropTypes.string,
    }),
  ).isRequired,
  migratingFacilities: PropTypes.arrayOf(
    PropTypes.shape({
      migrationDate: PropTypes.string,
      facilities: PropTypes.arrayOf(
        PropTypes.shape({
          facilityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          facilityName: PropTypes.string,
        }),
      ),
      phases: PropTypes.shape({
        current: PropTypes.string,
        p0: PropTypes.string,
        p1: PropTypes.string,
        p2: PropTypes.string,
        p3: PropTypes.string,
        p4: PropTypes.string,
        p5: PropTypes.string,
        p6: PropTypes.string,
        p7: PropTypes.string,
      }),
    }),
  ).isRequired,
  className: PropTypes.string,
  hasRefillable: PropTypes.bool,
};

// Module-scoped Set prevents duplicate Datadog events across remounts
// caused by loading state toggles (RTK Query isFetching flips).
const trackedInCardIds = new Set();
const trackedRenewalInCardIds = new Set();

/**
 * Shared hook for in-card Oracle Health transition Datadog tracking.
 * Fires a single event per prescriptionId per mount cycle, using a
 * module-scoped Set to deduplicate across RTK Query re-renders.
 */
const useTrackOracleHealthEvent = (
  prescriptionId,
  stationNumber,
  actionName,
  trackingSet,
) => {
  useEffect(
    () => {
      if (!trackingSet.has(prescriptionId)) {
        trackingSet.add(prescriptionId);
        datadogRum.addAction(actionName, {
          facilityId: stationNumber,
        });
      }
    },
    [prescriptionId, stationNumber, actionName, trackingSet],
  );

  useEffect(
    () => () => {
      trackingSet.delete(prescriptionId);
    },
    [prescriptionId, trackingSet],
  );
};

/**
 * Component for in-card Oracle Health transition alert.
 * Rendered by MedicationsListCard when a prescription's refill is blocked.
 */
export const OracleHealthInCardAlert = ({ stationNumber, prescriptionId }) => {
  useTrackOracleHealthEvent(
    prescriptionId,
    stationNumber,
    dataDogActionNames.oracleHealthTransition
      .T3_IN_CARD_REFILL_BLOCKED_ALERT_DISPLAYED,
    trackedInCardIds,
  );

  return (
    <va-alert
      class="vads-u-margin-top--2"
      status="error"
      background-only
      data-testid="oracle-health-in-card-alert"
    >
      <p className="vads-u-margin-y--0">
        You can’t refill this medication online right now. If you need more
        medication, call your VA pharmacy’s automated refill line.
      </p>
    </va-alert>
  );
};

OracleHealthInCardAlert.propTypes = {
  prescriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stationNumber: PropTypes.string,
};

/**
 * Component for in-card Oracle Health transition renewal alert.
 * Rendered by MedicationsListCard when a prescription's renewal is blocked
 * during phases p3-p5 (T-6 through T+2).
 */
export const OracleHealthRenewalInCardAlert = ({
  stationNumber,
  prescriptionId,
  isExpired = false,
}) => {
  useTrackOracleHealthEvent(
    prescriptionId,
    stationNumber,
    dataDogActionNames.oracleHealthTransition
      .T6_IN_CARD_RENEWAL_BLOCKED_ALERT_DISPLAYED,
    trackedRenewalInCardIds,
  );

  return (
    <va-alert
      class="vads-u-margin-top--2"
      status="error"
      background-only
      data-testid="oracle-health-renewal-in-card-alert"
    >
      <p className="vads-u-margin-y--0">
        {isExpired
          ? 'Your prescription is too old to refill. If you need more medication, call your provider to request a renewal.'
          : 'You don’t have any refills left. If you need more medication, call your provider to request a renewal.'}
      </p>
    </va-alert>
  );
};

OracleHealthRenewalInCardAlert.propTypes = {
  isExpired: PropTypes.bool,
  prescriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stationNumber: PropTypes.string,
};
