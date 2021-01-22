import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { externalServiceStatus } from 'platform/monitoring/DowntimeNotification';

function DowntimeBanner({ downtime, section }) {
  return (
    <AlertBox
      status="warning"
      isVisible
      headline={`We can’t show your ${section} information right now.`}
      content={
        <p>
          We’re sorry. The system that handles {section} information is down for
          maintenance right now. We hope to be finished with our work by{' '}
          {downtime.endTime.format('MMMM Do, LT')} Please check back soon.
        </p>
      }
    />
  );
}

function handleDowntimeForSection(section) {
  return (downtime, children) => {
    if (downtime.status === externalServiceStatus.down) {
      return <DowntimeBanner section={section} downtime={downtime} />;
    }
    return children;
  };
}

export { handleDowntimeForSection };

export default DowntimeBanner;
