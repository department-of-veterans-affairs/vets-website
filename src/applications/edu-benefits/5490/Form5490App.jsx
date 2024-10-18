import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from '~/platform/utilities/real-user-monitoring';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import formConfig from './config/form';

import './sass/5490.scss';

export default function Form5490Entry({ location, children }) {
  React.useEffect(
    () => {
      const checkbox = document.getElementById('root_view:noSSN');
      const input = document.getElementById(
        'root_relativeSocialSecurityNumber',
      );
      const disableSsnField = event => {
        if (event.target.checked) {
          input.setAttribute('disabled', true);
        } else {
          input.removeAttribute('disabled');
        }
      };

      if (checkbox && location.pathname === '/applicant/information') {
        checkbox?.addEventListener('change', disableSsnField);
      }
      return () => checkbox?.removeEventListener('change', disableSsnField);
    },
    [location.pathname],
  );

  const { TOGGLE_NAMES } = useFeatureToggle();
  useBrowserMonitoring({
    location,
    toggleName: TOGGLE_NAMES.disablityBenefitsBrowserMonitoringEnabled,
  });

  return (
    <>
      <div className="row">
        <div className="vads-u-margin-bottom--4">
          <VaBreadcrumbs
            label="Breadcrumbs"
            wrapping
            breadcrumbList={[
              {
                href: '/',
                label: 'Home',
              },
              {
                href: '/family-and-caregiver-benefits',
                label: 'Family and caregiver benefits',
              },
              {
                href: '/family-and-caregiver-benefits/education-and-careers',
                label: 'Education and career benefits for family members',
              },
              {
                href:
                  '/family-and-caregiver-benefits/education-and-careers/apply-dea-fry-form-22-5490',
                label: 'Apply for education benefits as an eligible dependent',
              },
            ]}
          />
        </div>
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
