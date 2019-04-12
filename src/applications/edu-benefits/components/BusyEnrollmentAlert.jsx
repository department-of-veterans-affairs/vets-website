import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function() {
  return (
    <AlertBox
      isVisible
      status="info"
      headline="We've started our busy spring enrollment season"
      content={
        <span>
          We process more GI Bill payments during this busy time of year, and we
          expect to keep up with the increase. But if your monthly payment is
          delayed, and you’re having trouble paying your bills or meeting your
          basic needs, please call us at{' '}
          <a href="tel:+18884424551">888-442-4551</a>. We're here Monday through
          Friday, 7:00 a.m. - 6:00 p.m. CT.
        </span>
      }
    />
  );
}
