import React from 'react';

import { VA_FORM_IDS } from 'platform/forms/constants';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';
import RateLimiter from 'platform/monitoring/RateLimiter';
import RateLimitContent from './components/RateLimitContent';

export default function VeteranIDCard({ location, children }) {
  return (
    <RateLimiter
      id="vic2"
      waitForProfile
      renderLimitedContent={RateLimitContent}
      bypassLimit={({ user }) =>
        user.profile.savedForms.some(f => f.form === VA_FORM_IDS.VIC)
      }
    >
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </RateLimiter>
  );
}
