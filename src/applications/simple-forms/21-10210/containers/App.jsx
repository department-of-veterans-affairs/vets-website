import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import environment from 'platform/utilities/environment';
import { WIP } from '../../shared/components/WIP';
import formConfig from '../config/form';
import { workInProgressContent } from '../definitions/constants';

export function App({ location, children, show2110210 }) {
  if (!show2110210 && !environment.isLocalhost()) {
    return <WIP content={workInProgressContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  show2110210: PropTypes.bool,
};

const mapStateToProps = state => ({
  show2110210: toggleValues(state)[FEATURE_FLAG_NAMES.form2110210] || false,
});

export default connect(mapStateToProps)(App);
