/**
 * @param {Object} location
 * @param {Object} [location.query]
 * @param {string} [location.query.id]
 */

import { updateFormPages, URLS } from '..';

const getTokenFromLocation = location => location?.query?.id;

const PRE_CHECK_IN_FORM_PAGES = Object.freeze([
  {
    url: URLS.VERIFY,
    order: 0,
  },
  {
    url: URLS.APPOINTMENTS,
    order: 1,
  },
  {
    url: URLS.DEMOGRAPHICS,
    order: 2,
  },
  {
    url: URLS.EMERGENCY_CONTACT,
    order: 4,
  },
  {
    url: URLS.NEXT_OF_KIN,
    order: 3,
  },
  {
    url: URLS.CONFIRMATION,
    order: 5,
  },
  {
    url: URLS.APPOINTMENT_DETAILS,
    order: 6,
  },
]);

const getPagesInOrder = () =>
  [...PRE_CHECK_IN_FORM_PAGES].sort((a, b) => a.order - b.order);

const createForm = () => {
  return getPagesInOrder().map(page => page.url);
};

const updateForm = patientDemographicsStatus => {
  const pages = PRE_CHECK_IN_FORM_PAGES.map(page => page.url);

  return updateFormPages(patientDemographicsStatus, pages, URLS);
};

export {
  PRE_CHECK_IN_FORM_PAGES,
  createForm,
  getPagesInOrder,
  getTokenFromLocation,
  updateForm,
};
