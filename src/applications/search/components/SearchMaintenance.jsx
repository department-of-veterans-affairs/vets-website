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
        headline="We couldn’t complete your search"
        type="warning"
      >
        We’re sorry. Something went wrong in our system. Try again later. Or use
        one of the other VA search tools on this page.
      </va-banner>
    </div>
  );
};

SearchMaintenance.propTypes = {
  unexpectedMaintenance: PropTypes.bool,
};

export default SearchMaintenance;
