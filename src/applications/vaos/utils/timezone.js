import timezones from './timezones.json';

export function stripDST(abbr) {
  return abbr?.replace('ST', 'T').replace('DT', 'T');
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
