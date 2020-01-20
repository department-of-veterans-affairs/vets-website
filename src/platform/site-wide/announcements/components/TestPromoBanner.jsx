import React from 'react';

import {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

import PromoBanner from './PromoBanner';

export default function TestPromoBanner({ dismiss }) {
  return (
    <PromoBanner
      type={PROMO_BANNER_TYPES.announcement}
      onClose={dismiss}
      href="https://www.va.gov/health-care"
      text="This is a sample Promo Banner"
    />
  );
}
