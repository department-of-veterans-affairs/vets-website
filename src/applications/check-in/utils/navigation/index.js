const getTokenFromLocation = location => location?.query?.id;

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
  URLS,
  goToNextPageWithToken,
  getTokenFromRouter,
};
