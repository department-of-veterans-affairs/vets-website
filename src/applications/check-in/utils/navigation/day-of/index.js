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

import { updateFormPages, URLS } from '..';

const CHECK_IN_FORM_PAGES = Object.freeze([
  {
    url: URLS.VALIDATION_NEEDED,
    order: 0,
  },
  {
    url: URLS.LOADING,
    order: 1,
  },
  {
    url: URLS.DEMOGRAPHICS,
    order: 2,
  },
  {
    url: URLS.EMERGENCY_CONTACT,
    order: 3,
  },
  {
    url: URLS.NEXT_OF_KIN,
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
const updateForm = patientDemographicsStatus => {
  const pages = CHECK_IN_FORM_PAGES.map(page => page.url);

  return updateFormPages(patientDemographicsStatus, pages, URLS);
};

export { CHECK_IN_FORM_PAGES, createForm, getTokenFromLocation, updateForm };
