// Node modules.
import React from 'react';
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const linkText = 'Go to My HealtheVet on VA.gov';
export const linkUrl = '/my-health';

export const App = () => {
  return (
    <MhvSimpleSigninCallToAction
      headingLevel="3"
      linkText={linkText}
      linkUrl={linkUrl}
    />
  );
};

export default App;
