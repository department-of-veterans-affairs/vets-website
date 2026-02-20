import React from 'react';
import PropTypes from 'prop-types';
import { CernerAlertContent } from './constants';

/**
 * Component to render alerts for facilities migrating to Oracle Health
 * Shows warning or error alerts based on the current migration phase
 */
const MigratingFacilitiesAlerts = ({
  healthTool,
  className,
  migratingFacilities,
}) => {
  const config = CernerAlertContent[healthTool];
  if (!config) return null;

  // Map over migrating facilities to create alerts
  const alerts = migratingFacilities.map((migration, index) => {
    const currentPhase = migration.phases.current;
    const isInWarningPhase = config.warningPhases?.includes(currentPhase);
    const isInErrorPhase = config.errorPhases?.includes(currentPhase);

    // If current phase is in neither warning nor error array, do not render an alert
    if (!isInWarningPhase && !isInErrorPhase) {
      return null;
    }

    const facilityText =
      migration.facilities.length > 1 ? 'these facilities' : 'this facility';
    const startDate = migration.phases[config.errorStartDate];
    const endDate = migration.phases[config.errorEndDate];

    // Render error alert if in error phase
    if (isInErrorPhase) {
      const errorHeadline = config.errorGetHeadline
        ? config.errorGetHeadline(endDate)
        : config.errorHeadline;

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
            {errorHeadline}
          </h2>
          <div>
            <p>
              {config.errorIntro && (
                <>
                  {config.errorIntro} from <strong>{startDate}</strong>, to{' '}
                  <strong>{endDate}</strong>{' '}
                </>
              )}
              {config.errorMessage} {facilityText} until{' '}
              <strong>{endDate}</strong>:
            </p>
            <ul>
              {migration.facilities.map((facility, i) => (
                <li key={i}>{facility.facilityName}</li>
              ))}
            </ul>
            {config.errorNote && (
              <>
                <p>{config.errorNote}</p>
                <va-link
                  data-testid="find-facility-link"
                  href="https://www.va.gov/find-locations/"
                  text="Find your facility's contact information"
                />
              </>
            )}
          </div>
        </va-alert>
      );
    }

    // Render warning alert
    return (
      <va-alert-expandable
        key={index}
        class={`vads-u-margin-bottom--2p5 ${className} ${
          migratingFacilities.length > 0 ? 'vads-u-margin-top--2' : ''
        }`}
        data-testid="cerner-facilities-transition-alert"
        status="warning"
        trigger={`Updates will begin on ${startDate}`}
      >
        <div>
          <p>
            From <strong>{startDate}</strong>, to <strong>{endDate}</strong>,{' '}
            {config.warningMessage} {facilityText}:
          </p>
          <ul>
            {migration.facilities.map((facility, i) => (
              <li key={i}>{facility.facilityName}</li>
            ))}
          </ul>
          {(config.warningGetNote || config.warningNote) && (
            <p>
              <strong>Note:</strong>{' '}
              {config.warningNote || config.warningGetNote(facilityText)}
            </p>
          )}
        </div>
      </va-alert-expandable>
    );
  });

  // Filter out null values and return alerts if any exist
  const validAlerts = alerts.filter(alert => alert !== null);
  return validAlerts.length > 0 ? <>{validAlerts}</> : null;
};

MigratingFacilitiesAlerts.propTypes = {
  healthTool: PropTypes.string.isRequired,
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
};

export default MigratingFacilitiesAlerts;
