const getTokenFromLocation = location => location?.query?.id;

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
  VALIDATION_NEEDED: 'verify',
  UPDATE_INSURANCE: 'update-information',
  SEE_STAFF: 'see-staff',
  DETAILS: 'details',
  COMPLETE: 'complete',
  ERROR: 'error',
  LANDING: '',
});

export { getTokenFromLocation, goToNextPage, URLS };
