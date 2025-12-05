import React, { useState } from 'react';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const MEET_WITH_COUNSELOR_OPTIONS = {
  YES: 'Yes, I prefer meeting with my Counselor',
  NO: 'No',
};

const meetWithCounselorRadioGroupName = 'meet_with_counselor';

export default function WatchVideoView({ setScheduleMeetingView }) {
  const [
    meetWithCounselorRadioValue,
    setMeetWithCounselorRadioValue,
  ] = useState();

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
      <VaRadio
        label="Still want to meet with your counselor?"
        onVaValueChange={e => setMeetWithCounselorRadioValue(e.detail.value)}
      >
        <VaRadioOption
          label={MEET_WITH_COUNSELOR_OPTIONS.NO}
          name={meetWithCounselorRadioGroupName}
          value={MEET_WITH_COUNSELOR_OPTIONS.NO}
        />
        <VaRadioOption
          label={MEET_WITH_COUNSELOR_OPTIONS.YES}
          name={meetWithCounselorRadioGroupName}
          value={MEET_WITH_COUNSELOR_OPTIONS.YES}
        />
      </VaRadio>
      <VaButton
        onClick={() => {
          if (meetWithCounselorRadioValue === MEET_WITH_COUNSELOR_OPTIONS.YES) {
            setScheduleMeetingView();
          }
        }}
        data-testid="submit-counselor-preference"
        text="Submit"
      />
    </>
  );
}

WatchVideoView.propTypes = {
  setScheduleMeetingView: PropTypes.func.isRequired,
};
