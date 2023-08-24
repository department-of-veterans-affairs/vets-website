import React from 'react';
import content from '../../locales/en/content.json';

const DowntimeWarning = () => (
  <va-alert status="warning">
    <h2 slot="headline">{content['alert-downtime-title']}</h2>
    <p>{content['alert-downtime-message']}</p>
  </va-alert>
);

export default DowntimeWarning;
