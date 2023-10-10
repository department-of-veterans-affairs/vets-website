// Node modules.
import React from 'react';
// Relative imports.
import config from '../../config/maintenanceBanner';

export const MaintenanceBanner = () => (
  <va-maintenance-banner
    banner-id={config.id}
    maintenance-end-date-time={config.expiresAt}
    maintenance-start-date-time={config.startsAt}
    maintenance-title={config.title}
    upcoming-warn-start-date-time={config.warnStartsAt}
  >
    <div slot="warn-content">
      <span>{config.warnContent}</span>
    </div>
    <div slot="maintenance-content">{config.content}</div>
  </va-maintenance-banner>
);

export default MaintenanceBanner;
