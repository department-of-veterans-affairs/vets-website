// Node modules.
import React from 'react';
import { PROMO_BANNER_TYPES } from '@department-of-veterans-affairs/component-library/PromoBanner';
// Relative imports.
import PromoBanner from './PromoBanner';

export default ({ dismiss }) => (
  <PromoBanner
    type={PROMO_BANNER_TYPES.announcement}
    onClose={dismiss}
    href="https://blogs.va.gov/VAntage/help-for-afghanistan-veterans-families/"
    text="Help for Afghanistan Veterans and families"
  />
);
