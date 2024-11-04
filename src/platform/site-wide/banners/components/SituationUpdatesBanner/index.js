// Node modules.
import React from 'react';
// Relative imports.
import config from '../../config/situationUpdatesBanner';

export const SituationUpdatesBanner = () => (
  <va-banner
    banner-id={config.id}
    // TODO add props for banner here, remove maintenance props
    maintenance-end-date-time={config.expiresAt}
    maintenance-start-date-time={config.startsAt}
    maintenance-title={config.title}
    upcoming-warn-start-date-time={config.warnStartsAt}
  >
    <div slot="warn-content">
      <span>{config.warnContent}</span>
    </div>
    <div slot="maintenance-content">{config.content}</div>
  </va-banner>
);

export default SituationUpdatesBanner;
