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
      {/* <p>
        On the next screen, we’ll ask you about your mental health conditions.
      </p>
      <p>
        First, we want you to know that you can get support for your mental
        health any time, day or night.
      </p> */}
      {mentalHealthSupportSummary}
      <h4>Mental health care</h4>
      {mentalHealthSupportTextBlob}
      {/* <br /> */}
      <h4>Military sexual trauma</h4>
      {militarySexualTraumaSupportTextBlob}
      {/* {mentalHealthSupportResources} */}
    </>
  );
};
