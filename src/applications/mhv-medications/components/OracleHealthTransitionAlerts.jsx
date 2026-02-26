import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';
import { CernerAlertContent } from '~/platform/mhv/components/CernerFacilityAlert/constants';
import { getPrescriptionDetailUrl } from '../util/helpers';
import { selectMhvMedicationsOracleHealthCutoverFlag } from '../util/selectors';

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

  // Don't render if feature flag is disabled
  if (!isOracleHealthCutoverEnabled) {
    return null;
  }

  // Don't render if no migration data or no blocked prescriptions
  if (!migratingFacilities?.length || !blockedPrescriptions?.length) {
    return null;
  }

  const blockedFacilityIds = [
    ...new Set(
      blockedPrescriptions
        .map(rx => String(rx.stationNumber))
        .filter(id => id != null && id !== 'undefined'),
    ),
  ];

  // Find migration schedule(s) that include the blocked prescription facilities
  const relevantMigration = migratingFacilities.find(migration =>
    migration.facilities?.some(f =>
      blockedFacilityIds.includes(String(f.facilityId)),
    ),
  );

  // Don't render if no matching migration found or no phases defined
  if (!relevantMigration?.phases) {
    return null;
  }

  const endDate = relevantMigration.phases[config.errorEndDate];
  const testId = hasRefillable
    ? 'oracle-health-t3-alert-with-refillable'
    : 'oracle-health-t3-alert-no-refillable';

  return (
    <va-alert
      class={`vads-u-margin-bottom--2p5 ${className}`}
      status="error"
      background-only
      data-testid={testId}
      data-dd-action-name="oracle-health-t3-alert-displayed"
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

/**
 * Component for in-card Oracle Health transition alert.
 * Rendered by MedicationsListCard when a prescription's refill is blocked.
 */
export const OracleHealthInCardAlert = () => (
  <va-alert
    class="vads-u-margin-top--2"
    status="error"
    background-only
    data-testid="oracle-health-in-card-alert"
    data-dd-action-name="oracle-health-in-card-alert-displayed"
  >
    <p className="vads-u-margin-y--0">
      You can’t refill this medication online right now. If you need more
      medication, call your VA pharmacy’s automated refill line.
    </p>
  </va-alert>
);

/**
 * Component for in-card Oracle Health transition renewal alert.
 * Rendered by MedicationsListCard when a prescription's renewal is blocked
 * during phases p3-p5 (T-6 through T+2).
 */
export const OracleHealthRenewalInCardAlert = () => (
  <va-alert
    class="vads-u-margin-top--2"
    status="error"
    background-only
    data-testid="oracle-health-renewal-in-card-alert"
    data-dd-action-name="oracle-health-renewal-in-card-alert-displayed"
  >
    <p className="vads-u-margin-y--0">
      You don’t have any refills left. If you need more medication, call your
      provider to request a renewal.
    </p>
  </va-alert>
);
