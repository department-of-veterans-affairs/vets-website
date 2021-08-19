import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';

const getAPI = () => {
  const isUnitTest = window.Mocha;
  const isCypress = window.Cypress;

  if (isUnitTest || isCypress) return MockApi;

  return LiveApi;
};

export default getAPI();
