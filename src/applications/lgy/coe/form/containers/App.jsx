import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import environment from 'platform/utilities/environment';
import { isLoggedIn } from 'platform/user/selectors';

import { generateCoe } from '../../shared/actions';
import formConfig from '../config/form';
import { isLoadingFeatures, showCoeFeature } from '../../shared/utils/helpers';
import { WIP } from '../../shared/components/WIP';

function App({
  children,
  getCoe,
  getCoeMock,
  isLoading,
  location,
  loggedIn,
  showCoe,
}) {
  useEffect(
    () => {
      if (typeof getCoeMock === 'function' && !environment.isProduction()) {
        getCoeMock(!loggedIn);
      } else {
        getCoe(!loggedIn);
      }
    },
    [getCoe, getCoeMock, loggedIn],
  );

  // Show WIP alert if the feature flag isn't set
  return showCoe && !isLoading ? (
    <article
      id="form-26-1880"
      data-location={`${location?.pathname?.slice(1)}`}
    >
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  ) : (
    <WIP />
  );
}

const mapDispatchToProps = {
  getCoe: generateCoe,
};

const mapStateToProps = state => ({
  isLoading: isLoadingFeatures(state),
  loggedIn: isLoggedIn(state),
  showCoe: showCoeFeature(state),
});

App.propTypes = {
  children: PropTypes.node.isRequired,
  getCoe: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  getCoeMock: PropTypes.func,
  isLoading: PropTypes.bool,
  loggedIn: PropTypes.bool,
  showCoe: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
