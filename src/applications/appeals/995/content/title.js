export const title995 = 'File a Supplemental Claim';
export const subTitle995 = 'VA Form 20-0995';

export const title4142 =
  'Authorize the release of non-VA medical records to the VA';
export const subTitle4142 = 'VA Forms 21-4142 and 21-4142a';

const paths4142 = [
  '/request-private-medical-records',
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
 * Determine page title based on the location pathname; set document title to
 * match the H1 text - needed when we switch to form 4142 in the flow
 * @param {LocationObject} currentLocation
 * @returns {String} page & document title
 */
export const getTitle = ({ currentLocation = window.location } = {}) => {
  const path = currentLocation.pathname || '';
  const title = isNonVaEvidencePage(path) ? title4142 : title995;
  document.title = title;
  return title;
};

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
