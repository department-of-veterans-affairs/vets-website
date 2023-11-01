import React from 'react';
import content from '../../locales/en/content.json';

const DowntimeWarning = () => (
  <va-alert status="warning" uswds>
    <h2 slot="headline">{content['alert-downtime-title']}</h2>
    <div>
      <p>{content['alert-downtime-message']}</p>
    </div>
  </va-alert>
);

export default DowntimeWarning;
