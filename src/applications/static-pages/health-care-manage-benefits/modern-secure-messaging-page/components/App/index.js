// Node modules.
import React from 'react';

// Relative imports.
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const App = () => {
  return (
    <MhvSimpleSigninCallToAction
      headingLevel="3"
      serviceDescription="send secure messages"
      linkText="send secure messages"
      linkUrl="/my-health/secure-messages/inbox"
    />
  );
};

export default App;
