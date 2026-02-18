import React from 'react';
import PropTypes from 'prop-types';
import { getDay, getHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const maintenanceDays = [2, 4]; // Days: 2 for Tuesday, 4 for Thursday
const maintenanceStartHour = 15; // Start time: 3 PM in 24-hour format
const maintenanceEndHour = 18; // End time: 6 PM in 24-hour format
const maintenanceTimezone = 'America/New_York';

export const isWithinMaintenanceWindow = () => {
  const now = new Date();
  const zonedNow = utcToZonedTime(now, maintenanceTimezone);

  return (
    maintenanceDays.includes(getDay(zonedNow)) &&
    getHours(zonedNow) >= maintenanceStartHour &&
    getHours(zonedNow) < maintenanceEndHour
  );
};

const SearchMaintenance = ({ unexpectedMaintenance }) => {
  if (!unexpectedMaintenance) {
    return null;
  }

  return (
    <div className="vads-u-margin-bottom--1p5">
      <va-banner
        data-label="Error banner"
        headline="Search Maintenance"
        type="warning"
      >
        We’re working on Search VA.gov right now. If you have trouble using the
        search tool, check back later. Thank you for your patience.
      </va-banner>
    </div>
  );
};

SearchMaintenance.propTypes = {
  unexpectedMaintenance: PropTypes.bool,
};

export default SearchMaintenance;
