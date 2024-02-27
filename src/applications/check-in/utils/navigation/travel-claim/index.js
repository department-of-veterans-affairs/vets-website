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

import { URLS } from '..';

const TRAVEL_PAY_FORM_PAGES = Object.freeze([
  {
    url: URLS.VERIFY,
    order: 1,
  },
  {
    url: URLS.TRAVEL_INTRO,
    order: 2,
  },
  {
    url: URLS.TRAVEL_SELECT,
    order: 3,
  },
  {
    url: URLS.TRAVEL_MILEAGE,
    order: 4,
  },
  {
    url: URLS.TRAVEL_VEHICLE,
    order: 4,
  },
  {
    url: URLS.TRAVEL_ADDRESS,
    order: 6,
  },
  {
    url: URLS.TRAVEL_REVIEW,
    order: 7,
  },
  {
    url: URLS.COMPLETE,
    order: 8,
  },
]);

const createForm = () => {
  return TRAVEL_PAY_FORM_PAGES.map(page => page.url);
};

export { TRAVEL_PAY_FORM_PAGES, createForm, getTokenFromLocation };
