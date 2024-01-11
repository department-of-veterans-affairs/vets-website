import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';

const PreferredFacilityAlert = () => {
  // use logging to track the volume of users who receive this alert
  useEffect(() => {
    return () => {
      recordEvent({
        event: 'ezr-missing-preferred-facility',
      });
    };
  }, []);

  return (
    <va-alert status="error" data-testid="ezr-preferred-facility-alert" uswds>
      <h3 slot="headline">
        You can’t update your information using this online form
      </h3>
      <div>
        <p>
          We’re sorry. Our records show that you can’t update your health
          benefits information online.
        </p>
        <p>
          You can update your health benefits information by phone, by mail, or
          in person.
        </p>
        <a href="/health-care/update-health-information/#how-do-i-update-my-information">
          Learn more about how to update your health benefits information
        </a>
      </div>
    </va-alert>
  );
};

export default PreferredFacilityAlert;
