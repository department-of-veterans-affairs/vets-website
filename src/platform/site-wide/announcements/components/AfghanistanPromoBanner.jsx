// Node modules.
import React from 'react';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/component-library/PromoBanner';

export default ({ dismiss }) => (
  <PromoBanner
    type={PROMO_BANNER_TYPES.announcement}
    onClose={dismiss}
    href="https://blogs.va.gov/VAntage/help-for-afghanistan-veterans-families/"
    text="Help for Afghanistan Veterans and families"
  />
);
