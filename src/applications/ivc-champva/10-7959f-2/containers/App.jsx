import React from 'react';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import WIP from '../../shared/components/WIP';
import formConfig from '../config/form';
import manifest from '../manifest.json';

export default function App({ location, children }) {
  document.title = `${manifest.appName} | Veterans Affairs`;

  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/health-care', label: 'Health care' },
    {
      href: '/health-care/foreign-medical-program',
      label: 'Foreign Medical Program',
    },
    { href: '/health-care/foreign-medical-program', label: 'File a claim' },
  ];
  const bcString = JSON.stringify(breadcrumbs);

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <Toggler toggleName={Toggler.TOGGLE_NAMES.form107959f2}>
        <Toggler.Enabled>
          <va-breadcrumbs breadcrumb-list={bcString} />
          <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
            <DowntimeNotification
              appTitle={`CHAMPVA Form ${formConfig.formId}`}
              dependencies={[
                externalServices.pega,
                externalServices.form107959f2,
              ]}
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
                'We’re rolling out the Foreign Medical Program (FMP) claims (VA Form 10-7959f-2) in stages. It’s not quite ready yet. Please check back again soon.',
              redirectLink: '/',
              redirectText: 'Return to VA home page',
            }}
          />
        </Toggler.Disabled>
      </Toggler>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
