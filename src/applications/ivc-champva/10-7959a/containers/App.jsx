import React from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { Toggler, useFeatureToggle } from 'platform/utilities/feature-toggles';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import formConfig from '../config/form';
import WIP from '../../shared/components/WIP';

const breadcrumbList = [
  { href: '/', label: 'Home' },
  {
    href: `/family-and-caregiver-benefits`,
    label: `Family and caregiver benefits`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/`,
    label: `Health and disability benefits for family and caregivers`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/champva`,
    label: `CHAMPVA benefits`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/champva/${
      formConfig.title
    }`,
    label: formConfig.title,
  },
];

export default function App({ location, children }) {
  // Following guide at https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-replace-a-form-page-using-#VAFormsLibrary-Howtoreplaceaformpageusingafeaturetoggle-Step-by-stepguide
  // for the FF-controlled claim resubmission page:
  const { useFormFeatureToggleSync } = useFeatureToggle();
  useFormFeatureToggleSync([
    'champvaEnableClaimResubmitQuestion',
    'champvaClaimsLlmValidation',
  ]);

  // Add Datadog RUM to the app
  useBrowserMonitoring({
    loggedIn: undefined,
    toggleName: 'form107959aBrowserMonitoringEnabled',
    applicationId: '0f3d4991-c7b5-4a28-89c6-ea0e3f47b291',
    clientToken: 'puba4a6137df6bf240ff5e86ec697348c71',
    service: 'ivc-champva-claims-10-7959a',
    version: '1.0.0',
    // record 100% of staging sessions, but only 20% of production
    sessionReplaySampleRate:
      environment.vspEnvironment() === 'staging' ? 100 : 20,
    sessionSampleRate: 50,
    beforeSend: event => {
      // Prevent PII from being sent to Datadog with click actions.
      if (event.action?.type === 'click') {
        // eslint-disable-next-line no-param-reassign
        event.action.target.name = 'Clicked item';
      }
      return true;
    },
  });

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <Toggler toggleName={Toggler.TOGGLE_NAMES.form107959a}>
        <Toggler.Enabled>
          <VaBreadcrumbs wrapping breadcrumbList={breadcrumbList} />
          <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
            <DowntimeNotification
              appTitle={`CHAMPVA Form ${formConfig.formId}`}
              dependencies={[
                externalServices.pega,
                externalServices.form107959a,
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
                'We’re rolling out the CHAMPVA Claim Form (VA Form 10-7959a) in stages. It’s not quite ready yet. Please check back again soon.',
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
