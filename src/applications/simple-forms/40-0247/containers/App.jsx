/* eslint-disable react/sort-prop-types */
import React from 'react';

import proptypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { WIP } from '../../shared/components/WIP';

import formConfig from '../config/form';
import { wipContent } from '../helpers';

export function App({ location, children, show400247 }) {
  if (!show400247) {
    return <WIP content={wipContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  show400247: toggleValues(state)[FEATURE_FLAG_NAMES.form400247],
});

App.propTypes = {
  location: proptypes.object,
  children: proptypes.element,
  show400247: proptypes.bool,
};

export default connect(mapStateToProps)(App);
