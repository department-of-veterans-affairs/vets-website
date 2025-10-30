import React from 'react';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../constants';
import Tier2PageContent from './Tier2PageContent';
import { ProfileHubItem } from './hub/ProfileHubItem';

const LettersAndDocuments = () => {
  return (
    <Tier2PageContent pageHeader="Letters and documents">
      <ProfileHubItem
        heading="VA letters and documents"
        content="Download your VA Benefit Summary Letter (sometimes called a VA award letter) and other benefit letters and documents"
        href="/records/download-va-letters/letters"
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.VETERAN_STATUS_CARD}
        content="Your Veteran Status Card makes it easy to prove your service and access Veteran discounts"
        href={PROFILE_PATHS.VETERAN_STATUS_CARD}
      />
    </Tier2PageContent>
  );
};

LettersAndDocuments.propTypes = {};

export default LettersAndDocuments;
