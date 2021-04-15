import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import recordEvent from 'platform/monitoring/record-event';

const App = ({ loading, location, children }) => {
  // find all yes/no check boxes and attach analytics events
  useEffect(
    () => {
      if (!loading) {
        const checkBoxes = [
          ...document.querySelectorAll('[value="Y"]'),
          ...document.querySelectorAll('[value="N"]'),
        ];
        for (const checkbox of checkBoxes) {
          checkbox.onclick = e => {
            recordEvent({
              'check-box-clicked': e.target,
              'check-box-value-selected': e.target.value,
            });
          };
        }
      }
    },
    [loading],
  );
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

const mapStateToProps = state => ({
  loading: toggleValues(state).loading,
});

App.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(App);
