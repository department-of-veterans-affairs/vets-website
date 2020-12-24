import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import formConfig from './config/form';

const HealthCareEntry = ({ location, children, hasMultipleAddress }) => {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

const mapStateToProps = state => ({
  hasMultipleAddress: toggleValues(state)[
    FEATURE_FLAG_NAMES.multipleAddress1010ez
  ],
});

HealthCareEntry.propTypes = {
  hasMultipleAddress: PropTypes.bool,
};

export default connect(mapStateToProps)(HealthCareEntry);
