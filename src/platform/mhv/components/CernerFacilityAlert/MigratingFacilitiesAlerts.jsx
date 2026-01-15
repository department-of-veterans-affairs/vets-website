import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component to render alerts for facilities migrating to Oracle Health
 * Shows warning or error alerts based on the current migration phase
 */
const MigratingFacilitiesAlerts = ({
  migratingFacilities,
  warning,
  error,
  startDate,
  endDate,
  transitionText,
  bodyTransitionText,
  altTransitionHeadline,
  className,
}) => {
  // Map over migrating facilities to create alerts
  const alerts = migratingFacilities.map((migration, index) => {
    // Check if current phase matches warning or error phases
    const currentPhase = migration.phases.current;
    const isInWarningPhase = warning.includes(currentPhase);
    const isInErrorPhase = error.includes(currentPhase);
    const facilityText =
      migration.facilities.length > 1 ? 'these facilities' : 'this facility';

    // If current phase is in neither warning nor error array, do not render an alert
    if (!isInWarningPhase && !isInErrorPhase) {
      return null;
    }

    // Render error alert if in error phase
    if (isInErrorPhase) {
      return (
        <va-alert
          key={index}
          class={`vads-u-margin-bottom--2p5 ${className} ${
            migratingFacilities.length > 0 ? 'vads-u-margin-top--2' : ''
          }`}
          status="error"
          background-only
        >
          <h2 className="vads-u-font-size--md" slot="headline">
            You can’t {altTransitionHeadline || `${transitionText} for`} some
            facilities right now
          </h2>
          <div>
            <p>
              You can’t {transitionText} for {facilityText} until{' '}
              <strong>{migration.phases[endDate]}</strong>:
            </p>
            <ul>
              {migration.facilities.map((facility, i) => (
                <li key={i}>{facility.facilityName}</li>
              ))}
            </ul>
            <p>
              If you need to {bodyTransitionText || transitionText} now, call
              the facility directly.
            </p>
            <va-link
              data-testid="find-facility-link"
              href="https://www.va.gov/find-locations/"
              text="Find your facility's contact information"
            />
          </div>
        </va-alert>
      );
    }
    // Else warning alert
    return (
      <va-alert-expandable
        key={index}
        class={`vads-u-margin-bottom--2p5 ${className} ${
          migratingFacilities.length > 0 ? 'vads-u-margin-top--2' : ''
        }`}
        data-testid="cerner-facilities-transition-alert"
        status="warning"
        trigger={`Updates will begin on ${migration.phases[startDate]}`}
      >
        <div>
          <p>
            From <strong>{migration.phases[startDate]}</strong> to{' '}
            <strong>{migration.phases[endDate]}</strong>, you won’t be able to{' '}
            {transitionText} at {facilityText}:
          </p>
          <ul>
            {migration.facilities.map((facility, i) => (
              <li key={i}>{facility.facilityName}</li>
            ))}
          </ul>
          <p>
            <strong>Note:</strong> During this time, you can still call{' '}
            {facilityText} to {bodyTransitionText || transitionText}.
          </p>
        </div>
      </va-alert-expandable>
    );
  });

  // Filter out null values and return alerts if any exist
  const validAlerts = alerts.filter(alert => alert !== null);
  return validAlerts.length > 0 ? <>{validAlerts}</> : null;
};

MigratingFacilitiesAlerts.propTypes = {
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
  warning: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.arrayOf(PropTypes.string).isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  transitionText: PropTypes.string.isRequired,
  bodyTransitionText: PropTypes.string,
  altTransitionHeadline: PropTypes.string,
  className: PropTypes.string,
};

export default MigratingFacilitiesAlerts;
