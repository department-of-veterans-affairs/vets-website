import React from 'react';
import { rootUrl as dashboardUrl } from '../../../../applications/personalization/dashboard/manifest.js';
import PromoBanner, { PROMO_BANNER_TYPES } from './PromoBanner';

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
