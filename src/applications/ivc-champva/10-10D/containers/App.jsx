import React, { useEffect } from 'react';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';
import formConfig from '../config/form';
import WIP from '../../shared/components/WIP';
import { addStyleToShadowDomOnPages } from '../../shared/utilities';

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
];

export default function App({ location, children }) {
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
  });

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <Toggler toggleName={Toggler.TOGGLE_NAMES.form1010d}>
        <Toggler.Enabled>
          <VaBreadcrumbs breadcrumbList={breadcrumbList} />
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
              headline: 'We’re still working on this form',
              description:
                'We’re working on a new online application form for CHAMPVA benefits. Check back soon. If you want to apply for CHAMPVA benefits now, you can use our PDF form.',
              redirectLink:
                '/family-and-caregiver-benefits/health-and-disability/champva/',
              redirectText: 'Learn about CHAMPVA benefits and how to apply',
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
