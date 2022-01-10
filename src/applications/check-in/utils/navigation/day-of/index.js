/**
 * @param {Object} location
 * @param {Object} [location.query]
 * @param {string} [location.query.id]
 */
const getTokenFromLocation = location => location?.query?.id;

/**
 * @param {Object} router
 * @param {string} target
 * @param {Object} [params]
 * @param {Object} [params.url]
 */

import { updateFormPages } from '..';

const URLS = Object.freeze({
  COMPLETE: 'complete',
  EMERGENCY_CONTACT: 'emergency-contact',
  DEMOGRAPHICS: 'contact-information',
  DETAILS: 'details',
  ERROR: 'error',
  LANDING: '',
  NEXT_OF_KIN: 'next-of-kin',
  SEE_STAFF: 'see-staff',
  UPDATE_INSURANCE: 'update-information',
  VALIDATION_NEEDED: 'verify',
});

const CHECK_IN_FORM_PAGES = Object.freeze([
  {
    url: URLS.VALIDATION_NEEDED,
    order: 0,
  },
  {
    url: URLS.DEMOGRAPHICS,
    order: 1,
  },
  {
    url: URLS.EMERGENCY_CONTACT,
    order: 2,
  },
  {
    url: URLS.NEXT_OF_KIN,
    order: 3,
  },
  {
    url: URLS.UPDATE_INSURANCE,
    order: 4,
  },
  {
    url: URLS.DETAILS,
    order: 5,
  },
  {
    url: URLS.COMPLETE,
    order: 6,
  },
]);

const createForm = () => {
  return CHECK_IN_FORM_PAGES.map(page => page.url);
};
const updateForm = (patientDemographicsStatus, isEmergencyContactEnabled) => {
  const pages = CHECK_IN_FORM_PAGES.map(page => page.url);

  return updateFormPages(
    patientDemographicsStatus,
    isEmergencyContactEnabled,
    pages,
    URLS,
  );
};

export {
  URLS,
  CHECK_IN_FORM_PAGES,
  createForm,
  getTokenFromLocation,
  updateForm,
};
