import React from 'react';

import FormApp from '../common/schemaform/containers/FormApp';
import formConfig from './config/form';
import RateLimiter from '../common/components/RateLimiter';
import RateLimitContent from './components/RateLimitContent';

export default function VeteranIDCard({ location, children }) {
  return (
    <RateLimiter
      id="vic2"
      renderLimitedContent={RateLimitContent}
      bypassLimiter={({ user }) => user.profile.savedForms.some(f => f.id === 'VIC')}>
      <FormApp formConfig={formConfig} currentLocation={location}>
        {children}
      </FormApp>
    </RateLimiter>
  );
}
