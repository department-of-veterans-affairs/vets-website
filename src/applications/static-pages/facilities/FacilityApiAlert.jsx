import React from 'react';

const FacilityApiAlert = () => (
  <va-alert status="info" visible uswds="false">
    <h2 slot="headline">There was a problem retrieving locations</h2>
    <div>
      <p>
        Our location finder isn’t working right now. We’re sorry about that.
        Please check back a bit later. Or, if you need location details right
        away, you can try searching for
        <a
          href="https://www.google.com/maps/search/?api=1&query=VA+locations+near+me"
          target="_blank"
          rel="noopener noreferrer"
        >
          “VA locations near me” in Google Maps.
        </a>
      </p>
    </div>
  </va-alert>
);

export default FacilityApiAlert;
