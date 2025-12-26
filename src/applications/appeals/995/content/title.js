import {
  APP_SUBHEADER,
  EVIDENCE_PRIVATE_AUTHORIZATION_URL,
  EVIDENCE_PRIVATE_DETAILS_URL,
  EVIDENCE_PRIVATE_PROMPT_URL,
  FORM_ID,
  LIMITED_CONSENT_DETAILS_URL,
  LIMITED_CONSENT_PROMPT_URL,
} from '../constants';

export const title995 = 'File a Supplemental Claim';
export const titleFormDetails = 'Additional forms you may need to complete';

const paths4142 = [
  EVIDENCE_PRIVATE_AUTHORIZATION_URL,
  LIMITED_CONSENT_PROMPT_URL,
  LIMITED_CONSENT_DETAILS_URL,
  EVIDENCE_PRIVATE_DETAILS_URL,
  EVIDENCE_PRIVATE_PROMPT_URL,
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
  return isNonVaEvidencePage(path) ? APP_SUBHEADER : FORM_ID;
};
