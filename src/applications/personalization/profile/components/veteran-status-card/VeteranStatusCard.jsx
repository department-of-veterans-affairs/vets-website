import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import ProofOfVeteranStatus from '../proof-of-veteran-status/ProofOfVeteranStatus';

import Headline from '../ProfileSectionHeadline';

const VeteranStatusCard = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const vetStatusCardToggle = useToggleValue(TOGGLE_NAMES.vetStatusStage1);

  return (
    <>
      <Headline>Veteran Status Card</Headline>
      <p className="veteran-status-description">
        This card makes it easy to prove your service and access Veteran
        discounts, all while keeping your personal information secure.
      </p>
      {vetStatusCardToggle ? <ProofOfVeteranStatus /> : null}
    </>
  );
};

export default VeteranStatusCard;
