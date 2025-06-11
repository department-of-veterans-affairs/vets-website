// Node modules.
import React from 'react';
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const linkText = 'Go to your medications';
export const linkUrl = '/my-health/medications';

export const App = () => {
  return (
    <MhvSimpleSigninCallToAction
      headingLevel="3"
      linkText={linkText}
      linkUrl={linkUrl}
    />
  );
};
App.displayName = 'ModernMedicationsWidget';

export default App;
