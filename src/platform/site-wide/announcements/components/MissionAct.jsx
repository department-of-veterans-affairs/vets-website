import React from 'react';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

export default function MissionAct({ dismiss }) {
  return (
    <PromoBanner
      type={PROMO_BANNER_TYPES.announcement}
      onClose={dismiss}
      href="https://missionact.va.gov/"
      text="Learn how you can get easier access to health care with the MISSION Act"
    />
  );
}
