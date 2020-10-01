import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

function Form1995Entry({ location, featureToggles, children }) {
  return (
    <RoutedSavableApp
      formConfig={formConfig(featureToggles)}
      currentLocation={location}
    >
      {children}
    </RoutedSavableApp>
  );
}
const mapStateToProps = state => ({
  featureToggles: toggleValues(state),
});
export default connect(mapStateToProps)(Form1995Entry);
