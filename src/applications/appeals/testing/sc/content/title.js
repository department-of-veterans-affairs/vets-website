export const title995 = 'File a Supplemental Claim';
export const subTitle995 = 'VA Form 20-0995';

export const titleFormDetails = 'Additional forms you may need to complete';

export const title4142 =
  'Authorize the release of non-VA medical records to the VA';
export const title4142Omb =
  'Authorization to disclose information to the Department of Veteran Affairs (VA)';
export const subTitle4142Omb = 'VA Forms 21-4142 and 21-4142a';
export const subTitle4142 = `${subTitle4142Omb} with ${subTitle995}`;

const paths4142 = [
  '/private-medical-records-authorization',
  '/private-medical-records',
  '/add-private-record-limitations',
];

const isNonVaEvidencePage = currentPath =>
  paths4142.some(path => currentPath.includes(path));

/**
 * @typedef LocationObject
 * @type {Object}
 * @property {String} pathname - pathname portion of the URL
 */
/**
 * Determine page subtitle based on the location pathname - needed when we
 * switch to form 4142 in the flow
 * @param {LocationObject} currentLocation
 * @returns {String} page subtitle
 */
export const getSubTitle = ({ currentLocation = window.location } = {}) => {
  const path = currentLocation.pathname || '';
  return isNonVaEvidencePage(path) ? subTitle4142 : subTitle995;
};
