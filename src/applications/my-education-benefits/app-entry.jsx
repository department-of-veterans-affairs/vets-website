import 'platform/polyfills';
import './sass/my-education-benefits.scss';

import startApp from 'platform/startup';

import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

const mapStateToProps = state => {
  const showMEBMailingAddressForeign = !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMEBMailingAddressForeign
  ];
  return {
    showMEBMailingAddressForeign,
  };
};

export default connect(mapStateToProps)(startApp);
