import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import { WIP } from '../../shared/components/WIP';
import { workInProgressContent } from '../definitions/constants';

function App({ location, children, show210972 }) {
  // console.info('[App] show210972:', show210972);
  if (!show210972) {
    return <WIP content={workInProgressContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  show210972: toggleValues(state)[FEATURE_FLAG_NAMES.form210972] || false,
});

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  show210972: PropTypes.bool,
};

export default connect(mapStateToProps)(App);
