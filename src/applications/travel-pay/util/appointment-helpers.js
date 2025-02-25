const timezones = require('./timezones.json');

export const getPractionerName = practitioners => {
  return `${practitioners[0].name.given?.join(' ')} ${
    practitioners[0].name?.family
  }`;
};

export function getTimezoneByFacilityId(id) {
  if (!id) {
    return null;
  }

  if (timezones[id]) {
    return timezones[id];
  }

  return timezones[id.substr(0, 3)];
}
