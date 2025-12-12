import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { DowntimeNotification } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { Toggler } from 'platform/utilities/feature-toggles';
import { WIP } from '../../shared/components/WIP';
import formConfig from '../config/form';

const wipContent = {
  description:
    'We’re rolling out the Marital Status Questionnaire (VA Form 21P-0537) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};

export default function App({ location, children }) {
  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.form21P0537}>
      <Toggler.Enabled>
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          <DowntimeNotification
            appTitle="Marital Status Questionnaire (21P-0537)"
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
  children: PropTypes.node,
  location: PropTypes.object,
};
