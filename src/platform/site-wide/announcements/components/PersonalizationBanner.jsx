import React from 'react';
import PromoBanner from './PromoBanner';
import { PROMO_BANNER_TYPES } from '@department-of-veterans-affairs/formation-react/PromoBanner';

import { rootUrl as dashboardUrl } from 'applications/personalization/dashboard/manifest.json';

export default function PersonalizationBanner({ dismiss, isLoggedIn }) {
  if (!isLoggedIn) return null;
  return (
    <PromoBanner
      type={PROMO_BANNER_TYPES.announcement}
      onClose={dismiss}
      href={dashboardUrl}
      text="Check out your new personalized homepage"
    />
  );
}
