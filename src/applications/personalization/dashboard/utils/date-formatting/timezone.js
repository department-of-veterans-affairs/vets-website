import timezones from './timezones.json';
import vaosTimeZones from './vaos-timezones.json';
import moment from '~/applications/personalization/dashboard/lib/moment-tz';

export const stripDST = abbr => {
  if (/^[PMCE][DS]T$/.test(abbr)) {
    return abbr?.replace('ST', 'T').replace('DT', 'T');
  }

  return abbr;
};

export const getTimezoneBySystemId = id =>
  timezones.find(z => z.id === `dfn-${id}`);

export const getVATimeZone = id => {
  const matchingZone = getTimezoneBySystemId(id);

  if (!matchingZone) {
    return null;
  }

  let abbreviation = matchingZone.currentTZ;

  // Strip out middle char in abbreviation so we can ignore DST
  if (matchingZone.timezone.includes('America')) {
    abbreviation = stripDST(abbreviation);
  }

  return abbreviation;
};

export const getCCTimeZone = appointment => {
  const zoneSplit = appointment.attributes?.timeZone.split(' ');
  return stripDST(zoneSplit[1]);
};

export function getTimezoneByFacilityId(id) {
  if (!id) {
    return null;
  }

  if (vaosTimeZones[id]) {
    return vaosTimeZones[id];
  }

  return vaosTimeZones[id.substring(0, 3)];
}

export function getTimezoneAbbrByFacilityId(id) {
  const matchingZone = getTimezoneByFacilityId(id);

  if (!matchingZone) {
    return null;
  }

  let abbreviation = moment.tz.zone(matchingZone).abbr(moment());

  // Strip out middle char in abbreviation so we can ignore DST
  if (matchingZone.includes('America')) {
    abbreviation = stripDST(abbreviation);
  }

  return abbreviation;
}

const TIMEZONE_LABELS = {
  PHT: 'Asia/Manila',
  ET: 'America/New_York',
  CT: 'America/Chicago',
  MT: 'America/Denver',
  PT: 'America/Los_Angeles',
  AKT: 'America/Anchorage',
};

export function getTimezoneNameFromAbbr(abbreviation) {
  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return label;
  }

  return abbreviation;
}

export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getUserTimezoneAbbr() {
  return Intl.DateTimeFormat('en', { timeZoneName: 'short' })
    .formatToParts()
    .find(p => p.type === 'timeZoneName').value;
}

/**
 * Returns an object with timezone identifiers for a given appointment
 *
 * @export
 * @param {Appointment} appointment The appointment to get a timezone for
 * @returns {Object} An object with:
 *   - identifier: The full timezone identifier (like America/New_York)
 *   - abbreviation: The timezone abbreviation (e.g. ET)
 *   - description: The written out description (e.g. Eastern time)
 */
export function getAppointmentTimezone(appointment) {
  if (appointment?.timeZone) {
    return {
      identifier: appointment.timeZone,
      abbreviation: appointment.timeZone,
      description: getTimezoneNameFromAbbr(appointment.timeZone),
    };
  }

  // Most VA appointments will use this, since they're associated with a facility
  if (appointment?.location?.vistaId) {
    const locationId =
      appointment.location.stationId || appointment.location.vistaId;
    const abbreviation = getTimezoneAbbrByFacilityId(locationId);

    return {
      identifier: moment.tz
        .zone(getTimezoneByFacilityId(locationId))
        ?.abbr(appointment.start),
      abbreviation,
      description: getTimezoneNameFromAbbr(abbreviation),
    };
  }

  // Community Care appointments with timezone included
  if (appointment?.vaos?.timeZone) {
    const abbreviation = stripDST(
      appointment.vaos.timeZone?.split(' ')?.[1] || appointment.vaos.timeZone,
    );

    return {
      identifier: null,
      abbreviation,
      description: getTimezoneNameFromAbbr(abbreviation),
    };
  }

  // Everything else will use the local timezone
  const abbreviation = stripDST(getUserTimezoneAbbr());
  return {
    identifier: getUserTimezone(),
    abbreviation,
    description: getTimezoneNameFromAbbr(abbreviation),
  };
}
