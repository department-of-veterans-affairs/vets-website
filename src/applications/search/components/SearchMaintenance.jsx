import React from 'react';
import PropTypes from 'prop-types';
import {
  add,
  getDay,
  getHours,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import { utcToZonedTime, format as tzFormat } from 'date-fns-tz';

const maintenanceDays = [2, 4]; // Days: 2 for Tuesday, 4 for Thursday
const maintenanceStartHour = 15; // Start time: 3 PM in 24-hour format
const maintenanceEndHour = 18; // End time: 6 PM in 24-hour format
const maintenanceDurationHours = maintenanceEndHour - maintenanceStartHour;
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

const calculateCurrentMaintenanceWindow = () => {
  // Current date and time in the specified timezone
  let start = new Date();
  start = utcToZonedTime(start, maintenanceTimezone);
  start = setHours(start, maintenanceStartHour);
  start = setMinutes(start, 0);
  start = setSeconds(start, 0);

  // Calculate end time by adding the duration to the start time
  const end = add(start, { hours: maintenanceDurationHours });

  // Format start and end dates to include timezone offset correctly
  const startFormatted = tzFormat(start, "EEE MMM d yyyy HH:mm:ss 'GMT'XXXX", {
    maintenanceTimezone,
  });

  const endFormatted = tzFormat(end, "EEE MMM d yyyy HH:mm:ss 'GMT'XXXX", {
    maintenanceTimezone,
  });

  return {
    start: startFormatted,
    end: endFormatted,
  };
};

const SearchMaintenance = ({ unexpectedMaintenance }) => {
  const { start, end } = calculateCurrentMaintenanceWindow(); // Use this for the next scheduled maintenance window

  if (unexpectedMaintenance) {
    return (
      <div className="vads-u-margin-bottom--1p5">
        <va-banner
          data-label="Error banner"
          headline="Search Maintenance"
          type="warning"
        >
          We’re working on Search VA.gov right now. If you have trouble using
          the search tool, check back later. Thank you for your patience.
        </va-banner>
      </div>
    );
  }

  return (
    <div className="vads-u-margin-bottom--1p5">
      <va-maintenance-banner
        banner-id="search-gov-maintenance-banner"
        maintenance-title="Search Maintenance"
        maintenance-start-date-time={start}
        maintenance-end-date-time={end}
        is-error
      >
        <div slot="maintenance-content">
          We’re working on Search VA.gov right now. If you have trouble using
          the search tool, check back after we’re finished. Thank you for your
          patience.
        </div>
      </va-maintenance-banner>
    </div>
  );
};

SearchMaintenance.propTypes = {
  unexpectedMaintenance: PropTypes.bool,
};

export default SearchMaintenance;
