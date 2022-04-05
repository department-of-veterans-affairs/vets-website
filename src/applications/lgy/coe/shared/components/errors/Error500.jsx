import React from 'react';

export const Error500 = () => {
  return (
    <va-alert close-btn-aria-label="Close notification" status="error" visible>
      <h3 slot="headline">We’re sorry. Something went wrong on our end</h3>
      <p>
        Please refresh this page or check back later. You can also sign out of
        VA.gov and try signing back into this page.
      </p>
      <p>
        If you get this error again, please call the VA.gov help desk at
        844-698-2311 (TTY: 711). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m.
        ET.
      </p>
    </va-alert>
  );
};
