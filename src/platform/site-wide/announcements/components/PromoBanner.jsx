import React from 'react';

import PromoBanner from '@department-of-veterans-affairs/component-library/PromoBanner';
import _recordEvent from 'platform/monitoring/record-event';

export default function PromoBannerWithAnalytics({
  recordEvent = _recordEvent,
  onClose,
  ...props
}) {
  return (
    <PromoBanner
      {...props}
      onClose={() => {
        recordEvent({
          event: 'nav-promo-banner-link',
        });
        onClose();
      }}
    />
  );
}
