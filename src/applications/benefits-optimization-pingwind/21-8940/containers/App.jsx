import React from 'react';

import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFormFeatureToggleSync } from 'platform/utilities/feature-toggles';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';

function App({ location, children }) {
  useFormFeatureToggleSync(['form218940DateValidation']);

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle="veteran's application for increase compensation based on unemployability"
        dependencies={[externalServices.lighthouseBenefitsIntake]}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
};

export default App;
