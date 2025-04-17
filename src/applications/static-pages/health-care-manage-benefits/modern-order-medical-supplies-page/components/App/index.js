// Node modules.
import React from 'react';
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const linkText = 'Order hearing aid and CPAP supplies online';
export const linkUrl = '/health-care/order-hearing-aid-or-CPAP-supplies-form';

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
