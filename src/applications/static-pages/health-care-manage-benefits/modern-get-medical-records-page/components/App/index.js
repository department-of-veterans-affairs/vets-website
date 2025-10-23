// Node modules.
import React from 'react';
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const linkText = 'Go to your medical records';
export const linkUrl = '/my-health/medical-records';

export const App = () => {
  return (
    <MhvSimpleSigninCallToAction
      headingLevel="4"
      linkText={linkText}
      linkUrl={linkUrl}
    />
  );
};

export default App;
