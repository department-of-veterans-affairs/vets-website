// Node modules.
import React from 'react';
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const App = () => {
  return (
    <MhvSimpleSigninCallToAction
      headingLevel="3"
      serviceDescription="view, schedule, or cancel your appointment online"
      linkText="Go to your appointments"
      linkUrl="/my-health/appointments"
    />
  );
};
App.displayName = 'ModernScheduleAppointmentsWidget';

export default App;
