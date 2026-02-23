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
      }),
    }),
  ).isRequired,
  className: PropTypes.string,
  hasRefillable: PropTypes.bool,
};
