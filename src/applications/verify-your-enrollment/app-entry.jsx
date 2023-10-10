import '@department-of-veterans-affairs/platform-polyfills';
import './sass/verify-your-enrollment.scss';
import PropTypes from 'prop-types';

import startApp from '@department-of-veterans-affairs/platform-startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

startApp.propTypes = {
  children: PropTypes.any,
};
