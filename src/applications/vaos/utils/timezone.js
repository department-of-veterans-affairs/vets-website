import timezones from './timezones.json';

const TIMEZONE_LABELS = {
  PHT: 'Philippine time',
  ET: 'Eastern time',
  CT: 'Central time',
  MT: 'Mountain time',
  PT: 'Pacific time',
  AKT: 'Alaska time',
};

export function stripDST(abbr) {
  if (/^[PMCE][DS]T$/.test(abbr)) {
    return abbr?.replace('ST', 'T').replace('DT', 'T');
  }

  return abbr;
}

export function getTimezoneBySystemId(id) {
  return timezones.find(z => z.id === `dfn-${id}`);
}

export function getTimezoneAbbrBySystemId(id) {
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
}

export function getTimezoneDescBySystemId(id) {
  const abbreviation = getTimezoneAbbrBySystemId(id);
  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return `${label} (${abbreviation})`;
  }

  return abbreviation;
}

export function getTimezoneDescFromAbbr(abbreviation) {
  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return label;
  }

  return abbreviation;
}
