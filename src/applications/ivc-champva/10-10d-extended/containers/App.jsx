import React from 'react';

import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { Toggler } from 'platform/utilities/feature-toggles';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import WIP from '../../shared/components/WIP';

import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.form1010dExtended}>
      <Toggler.Enabled>
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          <DowntimeNotification
            appTitle={`CHAMPVA Form ${formConfig.formId}`}
            dependencies={[externalServices.pega]}
          >
            {children}
          </DowntimeNotification>
        </RoutedSavableApp>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <br />
        <WIP
          content={{
            description:
              'We’re rolling out the CHAMPVA Application (VA Form 10-10d) in stages. It’s not quite ready yet. Please check back again soon.',
            redirectLink: '/',
            redirectText: 'Return to VA home page',
          }}
        />
      </Toggler.Disabled>
    </Toggler>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
