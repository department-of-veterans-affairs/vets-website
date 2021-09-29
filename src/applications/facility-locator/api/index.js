import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';

const getAPI = () => {
  const isUnitTest = window.Mocha;
  return isUnitTest ? MockApi : LiveApi;
};

export default getAPI();
