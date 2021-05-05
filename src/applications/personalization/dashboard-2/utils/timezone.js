import timezones from '~/applications/vaos/utils/timezones.json';

export const stripDST = abbr => {
  if (/^[PMCE][DS]T$/.test(abbr)) {
    return abbr?.replace('ST', 'T').replace('DT', 'T');
  }

  return abbr;
};

export const getVATimeZone = id => {
  const matchingZone = timezones.find(z => z.id === `dfn-${id}`);

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
