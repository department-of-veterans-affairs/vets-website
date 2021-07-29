import React from 'react';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/component-library/PromoBanner';

export default function CovidVaccineSignup({ dismiss }) {
  return (
    <PromoBanner
      type={PROMO_BANNER_TYPES.announcement}
      onClose={dismiss}
      href="/health-care/covid-19-vaccine/"
      text="Get a COVID-19 vaccine at VA"
    />
  );
}
