// Node modules.
import React from 'react';
// Relative imports.
import config from './config';

export const SituationUpdatesBanner = () => (
  <va-banner
    banner-id={config.id}
    type={config.alertType}
    headline={config.headline}
    show-close={config.showClose}
    // visible={false} TODO: Uncomment this line before opening PR for review
  >
    <div slot="content">
      <span>{config.content}</span>
    </div>
  </va-banner>
);

export default SituationUpdatesBanner;
