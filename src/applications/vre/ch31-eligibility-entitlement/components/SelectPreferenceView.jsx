import React, { useState } from 'react';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ORIENTATION_TYPE = {
  WATCH_VIDEO: 'Watch the VA Orientation Video online',
  SCHEDULE_MEETING: 'Schedule a meeting with my local RO',
};

const preferenceRadioGroupName = 'orientation_type_preference';

export default function SelectPreferenceView() {
  const [orientationTypeRadioValue, setOrientationTypeRadioValue] = useState();
  const [attestationChecked, setAttestationChecked] = useState(false);

  const submitAttestation = () => {
    // TODO: Impelement submission logic
  };

  return (
    <>
      <p>
        You will need to complete your Orientation by either scheduling a
        meeting with your local RO, or by watching online the VA Orientation
        Video.
      </p>
      <p>
        Which is your preferred course of action? Please, make your selection:
      </p>
      <VaRadio
        label="My preference is to:"
        onVaValueChange={e => {
          setOrientationTypeRadioValue(e.detail.value);
          setAttestationChecked(false);
        }}
      >
        <VaRadioOption
          label={ORIENTATION_TYPE.WATCH_VIDEO}
          name={preferenceRadioGroupName}
          value={ORIENTATION_TYPE.WATCH_VIDEO}
        />
        {orientationTypeRadioValue === ORIENTATION_TYPE.WATCH_VIDEO && (
          <div className="vads-u-margin-left--4">
            <p>
              VR&E services can help Veterans with job training, employment
              accommodations, resume development, and coaching. Please watch the
              full video and self-certify upon completion.
            </p>
            <p>
              <va-link channel href="https://www.va.gov" text="Link" />
            </p>
            <VaCheckbox
              checkboxDescription="Please check the box above if you have watched the Video Tutorial provided."
              label="I acknowledge and attest that I have watched and understand the five Paths for Career Planning."
              checked={attestationChecked}
              onVaChange={e => setAttestationChecked(e.target.checked)}
            />
            <VaButton onClick={submitAttestation} text="Submit" />
          </div>
        )}
        <VaRadioOption
          label={ORIENTATION_TYPE.SCHEDULE_MEETING}
          name={preferenceRadioGroupName}
          value={ORIENTATION_TYPE.SCHEDULE_MEETING}
        />
        {orientationTypeRadioValue === ORIENTATION_TYPE.SCHEDULE_MEETING && (
          <div className="vads-u-margin-left--4">
            <p>
              You will be redirected to an external link to schedule your
              Orientation appointment with your local RO.
            </p>
            <va-link-action
              href="https://va.gov/vso/"
              text="Schedule your appointment"
              type="primary"
            />
          </div>
        )}
      </VaRadio>
    </>
  );
}
