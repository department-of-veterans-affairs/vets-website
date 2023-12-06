import timezones from './timezones.json';
import moment from '../lib/moment-tz';

const TIMEZONE_LABELS = {
  PHT: 'Philippine time',
  ET: 'Eastern time',
  CT: 'Central time',
  MT: 'Mountain time',
  PT: 'Pacific time',
  AKT: 'Alaska time',
};

export function stripDST(abbr) {
  if (/^[PMCE][DS]T$|^AK[DS]T$/.test(abbr)) {
    return abbr?.replace('ST', 'T').replace('DT', 'T');
  }

  return abbr;
}

export function getTimezoneByFacilityId(id) {
  if (!id) {
    return null;
  }

  if (timezones[id]) {
    return timezones[id];
  }

  return timezones[id.substr(0, 3)];
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

export function getTimezoneDescByFacilityId(id) {
  const abbreviation = getTimezoneAbbrByFacilityId(id);
  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return `${label} (${abbreviation})`;
  }

  return abbreviation;
}

export function getTimezoneNameFromAbbr(abbreviation) {
  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return label;
  }

  return abbreviation;
}

export function getUserTimezone() {
  return moment.tz.guess();
}

export function getUserTimezoneAbbr() {
  return moment()
    .tz(getUserTimezone())
    .zoneAbbr();
}
