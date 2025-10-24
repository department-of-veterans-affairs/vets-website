import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';

function App({ location, children }) {
  return (
    // <Toggler toggleName={Toggler.TOGGLE_NAMES.form21P601}>
    //   <Toggler.Enabled>
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle="Application for Accrued Amounts Due a Deceased Beneficiary"
        dependencies={[externalServices.lighthouseBenefitsIntake]}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
    //   </Toggler.Enabled>
    //   <Toggler.Disabled>
    //     <br />
    //     <WIP content={wipContent} />
    //   </Toggler.Disabled>
    // </Toggler>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default App;
