import React from 'react';

import FormApp from '../common/schemaform/containers/FormApp';
import formConfig from './config/form';
import RateLimiter from '../../platform/monitoring/RateLimiter';
import RateLimitContent from './components/RateLimitContent';

export default function VeteranIDCard({ location, children }) {
  return (
    <RateLimiter
      id="vic2"
      waitForProfile
      renderLimitedContent={RateLimitContent}
      bypassLimit={({ user }) => user.profile.savedForms.some(f => f.form === 'VIC')}>
      <FormApp formConfig={formConfig} currentLocation={location}>
        {children}
      </FormApp>
    </RateLimiter>
  );
}
