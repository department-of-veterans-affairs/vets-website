import React from 'react';

import InfoAlert from '../../components/InfoAlert';

export default function AppointmentDetailsErrorMessage() {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert
        status="error"
        level={1}
        headline="We can’t access your appointment details right now"
      >
        We’re sorry. There’s a problem with our system. Refresh this page or try
        again later.
      </InfoAlert>
    </div>
  );
}
