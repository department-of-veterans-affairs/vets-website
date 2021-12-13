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
const goToNextPage = (router, target, params) => {
  if (params) {
    const query = {
      pathname: target,
    };
    if (params.url) {
      // get all url keys
      const keys = Object.keys(params.url);
      const queryParams = keys
        .map(key => `${key}=${params.url[key]}`)
        .join('&');

      // append to string
      const search = queryParams ? `?${queryParams}` : '';
      // add to query
      query.search = search;
    }
    router.push(query);
  } else {
    router.push(target);
  }
};

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

export { getTokenFromLocation, goToNextPage, URLS };
