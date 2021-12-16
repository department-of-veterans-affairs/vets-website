import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export default function LearnMoreAboutMilitaryBaseTooltip() {
  return (
    <AdditionalInfo
      onClick={function noRefCheck() {}}
      triggerText="Learn more about military base addresses"
    >
      <p>
        U.S. military bases are considered a domestic address and a part of the
        United States.
      </p>
    </AdditionalInfo>
  );
}
