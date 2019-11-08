import React from 'react';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

export default function VeteransDayProclamation({ dismiss }) {
  return (
    <PromoBanner
      type={PROMO_BANNER_TYPES.announcement}
      onClose={dismiss}
      target="_blank"
      href="https://www.blogs.va.gov/VAntage/67843/secretary-wilkies-veterans-day-2019-message/"
      text="Watch Secretary Robert Wilkie’s Veterans Day message"
    />
  );
}
