import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { DowntimeNotification } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { Toggler, useFeatureToggle } from 'platform/utilities/feature-toggles';
import { WIP } from '../../shared/components/WIP';
import formConfig from '../config/form';

const wipContent = {
  description:
    'We’re rolling out the Application for Accrued Amounts Due a Deceased Beneficiary (VA Form 21P-601) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};

function App({ location, children }) {
  const {
    useFormFeatureToggleSync,
    useToggleValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  useFormFeatureToggleSync(['bioHeartMMSSubmit']);
  const bioEndpointEnabled = useToggleValue(TOGGLE_NAMES.bioHeartMMSSubmit);

  formConfig.submitUrl = bioEndpointEnabled
    ? `${environment.API_URL}/bio_heart_api/v1/bio_heart`
    : `${environment.API_URL}/simple_forms_api/v1/simple_forms`;

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.form21P601}>
      <Toggler.Enabled>
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          <DowntimeNotification
            appTitle="Application for Accrued Amounts Due a Deceased Beneficiary"
            dependencies={formConfig.downtime.dependencies}
          >
            {children}
          </DowntimeNotification>
        </RoutedSavableApp>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <br />
        <WIP content={wipContent} />
      </Toggler.Disabled>
    </Toggler>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default App;
