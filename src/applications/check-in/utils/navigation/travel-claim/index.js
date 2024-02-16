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

const TRAVEL_PAY_FORM_PAGES = Object.freeze([
  {
    url: URLS.VERIFY,
    order: 1,
  },
  {
    url: URLS.COMPLETE,
    order: 2,
  },
]);

const createForm = () => {
  return TRAVEL_PAY_FORM_PAGES.map(page => page.url);
};
const updateForm = (
  patientDemographicsStatus,
  isTravelReimbursementEnabled,
  appointments,
  isTravelLogicEnabled,
  travelPaySent,
) => {
  const pages = TRAVEL_PAY_FORM_PAGES.map(page => page.url);

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

export { TRAVEL_PAY_FORM_PAGES, createForm, getTokenFromLocation, updateForm };
