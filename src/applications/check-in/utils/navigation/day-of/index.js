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
    url: URLS.TRAVEL_QUESTION,
    order: 5,
  },
  {
    url: URLS.TRAVEL_VEHICLE,
    order: 6,
  },
  {
    url: URLS.TRAVEL_ADDRESS,
    order: 7,
  },
  {
    url: URLS.TRAVEL_MILEAGE,
    order: 8,
  },
  {
    url: URLS.TRAVEL_REVIEW,
    order: 9,
  },
  {
    url: URLS.DETAILS,
    order: 10,
  },
  {
    url: URLS.COMPLETE,
    order: 11,
  },
]);

const createForm = () => {
  return CHECK_IN_FORM_PAGES.map(page => page.url);
};
const updateForm = (
  patientDemographicsStatus,
  isTravelReimbursementEnabled,
  appointments,
  isTravelLogicEnabled,
  travelPaySent,
) => {
  const pages = CHECK_IN_FORM_PAGES.map(page => page.url);

  return updateFormPages(
    patientDemographicsStatus,
    pages,
    URLS,
    isTravelReimbursementEnabled,
    appointments,
    isTravelLogicEnabled,
    travelPaySent,
  );
};

export { CHECK_IN_FORM_PAGES, createForm, getTokenFromLocation, updateForm };
