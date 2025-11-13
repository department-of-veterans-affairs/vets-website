import React from 'react';
import {
  mentalHealthSupportSummary,
  mentalHealthSupportTextBlob,
  militarySexualTraumaSupportTextBlob,
} from './form0781';

export const mentalHealthSupportPageTitle =
  'Mental health and military sexual trauma';

export const mentalHealthSupportDescription = () => {
  return (
    <>
      {mentalHealthSupportSummary}
      <h4>Mental health care</h4>
      {mentalHealthSupportTextBlob}
      <h4>Military sexual trauma</h4>
      {militarySexualTraumaSupportTextBlob}
    </>
  );
};
