import React from 'react';

import PromoBanner from '@department-of-veterans-affairs/formation-react/PromoBanner';
import recordEvent from 'platform/monitoring/record-event';

export default function PromoBannerWithAnalytics({ onClose, ...props }) {
  return (
    <PromoBanner
      {...props}
      onClose={event => {
        recordEvent({
          'event': 'nav-promo-banner-link'
        });
        onClose();
      }}
    />
  )
}
