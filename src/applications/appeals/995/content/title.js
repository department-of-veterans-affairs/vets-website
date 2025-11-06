import { subTitle4142 } from './evidence/form4142';
import { FORM_ID } from '../constants';

export const title995 = 'File a Supplemental Claim';
export const titleFormDetails = 'Additional forms you may need to complete';

const paths4142 = [
  '/private-medical-records-authorization',
  '/add-limitation',
  '/limitation',
  '/private-medical-records',
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
  return isNonVaEvidencePage(path) ? subTitle4142 : FORM_ID;
};
