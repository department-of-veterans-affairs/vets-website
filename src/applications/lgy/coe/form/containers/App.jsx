import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import environment from 'platform/utilities/environment';
import { isLoggedIn } from 'platform/user/selectors';

import { generateCoe } from '../../shared/actions';
import formConfig from '../config/form';

function App({ children, getCoe, getCoeMock, location, loggedIn }) {
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

  return (
    <article
      id="form-26-1880"
      data-location={`${location?.pathname?.slice(1)}`}
    >
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );
}

const mapDispatchToProps = {
  getCoe: generateCoe,
};

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
});

App.propTypes = {
  children: PropTypes.node.isRequired,
  getCoe: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  getCoeMock: PropTypes.func,
  loggedIn: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
