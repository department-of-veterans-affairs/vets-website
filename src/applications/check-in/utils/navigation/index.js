const getTokenFromLocation = location => location?.query?.id;

const URLS = Object.freeze({
  UPDATE_INSURANCE: 'update-information',
  SEE_STAFF: 'see-staff',
});

const goToNextPageWithToken = () => {};
const getTokenFromRouter = () => {};

export {
  getTokenFromLocation,
  URLS,
  goToNextPageWithToken,
  getTokenFromRouter,
};
