const getTokenFromLocation = location => location?.query?.id;

const goToNextPage = (router, target) => {
  router.push(target);
};

const URLS = Object.freeze({
  UPDATE_INSURANCE: 'update-information',
  SEE_STAFF: 'see-staff',
  DETAILS: 'details',
  COMPLETE: 'complete',
});

const goToNextPageWithToken = () => {};
const getTokenFromRouter = () => {};

export {
  getTokenFromLocation,
  goToNextPage,
  URLS,
  goToNextPageWithToken,
  getTokenFromRouter,
};
