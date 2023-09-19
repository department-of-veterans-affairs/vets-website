import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { WIP } from '../../shared/components/WIP';

import formConfig from '../config/form';
import { workInProgressContent } from '../definitions/constants';

function App({ location, children, show210845 }) {
  if (!show210845) {
    return <WIP content={workInProgressContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  show210845: toggleValues(state)[FEATURE_FLAG_NAMES.form210845] || false,
});

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  show210845: PropTypes.bool,
};

export default connect(mapStateToProps)(App);
