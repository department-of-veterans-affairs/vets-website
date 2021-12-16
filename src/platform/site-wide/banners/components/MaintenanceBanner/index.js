// Node modules.
import React from 'react';
import ReusableMaintenanceBanner from '@department-of-veterans-affairs/component-library/MaintenanceBanner';
// Relative imports.
import config from '../../config/maintenanceBanner';

export const MaintenanceBanner = () => (
  <ReusableMaintenanceBanner
    content={config.content}
    expiresAt={config.expiresAt}
    id={config.id}
    localStorage={localStorage}
    startsAt={config.startsAt}
    title={config.title}
    warnContent={config.warnContent}
    warnStartsAt={config.warnStartsAt}
    warnTitle={config.warnTitle}
  />
);

export default MaintenanceBanner;
