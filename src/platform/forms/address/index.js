import constants from 'vets-json-schema/dist/constants.json';

// states.USA_OTHER = states.USA.concat([{ label: 'Other', value: 'Other' }]).sort(
//   (a, b) => a.label.localeCompare(b.label),
// );

export const { countries, states } = constants;

export function isValidUSZipCode(value) {
  return /(^\d{5}$)|(^\d{5}[ -]{0,1}\d{4}$)/.test(value);
}

export function isValidCanPostalCode(value) {
  return /^[a-zA-Z]\d[a-zA-Z][ -]{0,1}\d[a-zA-Z]\d$/.test(value);
}
