import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const FacilityApiAlert = () => (
  <AlertBox
    headline="There was a problem retrieving locations."
    status="info"
    isVisible
  >
    Our location finder isn’t working right now. We’re sorry about that. Please
    check back a bit later. Or, if you need location details right away, you can
    try searching for{' '}
    <a
      href="https://www.google.com/maps/search/?api=1&query=VA+locations+near+me"
      target="_blank"
      rel="noopener noreferrer"
    >
      “VA locations near me” in Google Maps
    </a>
    .
  </AlertBox>
);

export default FacilityApiAlert;
