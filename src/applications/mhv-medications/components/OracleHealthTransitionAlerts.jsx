import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { CernerAlertContent } from '~/platform/mhv/components/CernerFacilityAlert/constants';

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
  const config = CernerAlertContent.MEDICATIONS;
  const migration = migratingFacilities?.[0];

  // Don't render if no migration data or no blocked prescriptions
  if (!migration?.phases || !blockedPrescriptions?.length) {
    return null;
  }

  const endDate = migration.phases[config.errorEndDate];
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
                to={`/prescription/${prescription.prescriptionId}`}
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
