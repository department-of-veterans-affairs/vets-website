import React from 'react';

import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import formConfig from '../config/form';
import { WIP } from '../../shared/components/WIP';
import { workInProgressContent } from '../definitions/constants';

export function App({ location, children, show21P0847 }) {
  if (!show21P0847) {
    return <WIP content={workInProgressContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  show21P0847: toggleValues(state)[FEATURE_FLAG_NAMES.form21P0847] || false,
});

export default connect(mapStateToProps)(App);
