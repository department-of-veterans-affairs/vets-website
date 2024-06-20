import React from 'react';
import PropTypes from 'prop-types';

import { externalServiceStatus } from '~/platform/monitoring/DowntimeNotification';

function DowntimeBanner({ downtime, section }) {
  return (
    <va-alert status="warning" visible uswds>
      <h3 slot="headline">
        {`We can’t show your ${section} information right now.`}
      </h3>

      <p className="vads-u-margin-bottom--0">
        {`We’re sorry. The system that handles ${section} information is down for
        maintenance right now. We hope to be finished with our work by ${downtime.endTime.format(
          'MMMM Do, LT',
        )} Please check back soon.`}
      </p>
    </va-alert>
  );
}

DowntimeBanner.propTypes = {
  downtime: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
};

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
