import React from 'react';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function WatchVideoView() {
  return (
    <>
      <VaAlert className="vads-u-margin-top--2" status="success">
        <h2 slot="headline">You have opted for the Video Tutorial</h2>
        <p className="vads-u-margin-y--0">
          You have opted to complete your Orientation by watching the VA Video
          Tutorial.
        </p>
      </VaAlert>
      <h3 className="vads-u-font-size--h4">
        <va-link href="https://www.va.gov" text="Video Tutorial 1" />
      </h3>
      <p>More details in here.</p>
      <p>
        You will need to watch the full video to obtain a certificate of
        completion.
      </p>
      <p>
        <va-link video href="https://www.va.gov" text="Link" />
      </p>
      <p>
        <va-link
          download
          filetype="PDF"
          href="https://www.va.gov"
          text="Download Certificate of Completion"
        />
      </p>
      <VaRadio label="Still want to meet with your counselor?">
        <VaRadioOption label="No" name="second_preference" value="1" />
        <VaRadioOption
          label="Yes, I prefer meeting with my Counselor"
          name="second_preference"
          value="2"
        />
      </VaRadio>
      <VaButton text="Submit" />
    </>
  );
}
