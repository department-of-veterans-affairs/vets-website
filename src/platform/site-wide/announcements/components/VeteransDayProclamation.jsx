import React from 'react';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

export default function VeteransDayProclamation({ dismiss }) {
  return (
    <PromoBanner
      type={PROMO_BANNER_TYPES.announcement}
      onClose={dismiss}
      href="https://www.va.gov/opa/vetsday/docs/National_Veterans_and_Military_Families_Month_Proclamation_2019.pdf"
      text="Read President Donald Trump's proclamation celebrating National Veterans and Military Families Month"
    />
  );
}
