import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import environment from 'platform/utilities/environment';

import formConfig from '../config/form';
import { workInProgressContent } from '../definitions/constants';

import { WIP } from '../../shared/components/WIP';

export function App({ location, children, show264555 }) {
  if (!show264555 && !environment.isLocalhost()) {
    return <WIP content={workInProgressContent} />;
  }
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  show264555: PropTypes.bool,
};

const mapStateToProps = state => ({
  show264555: toggleValues(state)[FEATURE_FLAG_NAMES.form264555] || false,
});

export default connect(mapStateToProps)(App);
