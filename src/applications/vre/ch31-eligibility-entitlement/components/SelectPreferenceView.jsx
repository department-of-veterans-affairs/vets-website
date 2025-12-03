import React, { useState } from 'react';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const preferenceRadioGroupName = 'orientation_type_preference';

export default function SelectPreferenceView({
  setSelectedPreference,
  ORIENTATION_TYPE,
}) {
  const [orientationTypeRadioValue, setOrientationTypeRadioValue] = useState(
    ORIENTATION_TYPE.SCHEDULE_MEETING,
  );
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
        onVaValueChange={e => setOrientationTypeRadioValue(e.detail.value)}
      >
        <VaRadioOption
          checked
          label={ORIENTATION_TYPE.SCHEDULE_MEETING}
          name={preferenceRadioGroupName}
          value={ORIENTATION_TYPE.SCHEDULE_MEETING}
        />
        <VaRadioOption
          label={ORIENTATION_TYPE.WATCH_VIDEO}
          name={preferenceRadioGroupName}
          value={ORIENTATION_TYPE.WATCH_VIDEO}
        />
      </VaRadio>
      <VaButton
        onClick={() => setSelectedPreference(orientationTypeRadioValue)}
        text="Submit"
      />
    </>
  );
}

SelectPreferenceView.propTypes = {
  setSelectedPreference: PropTypes.func.isRequired,
  ORIENTATION_TYPE: PropTypes.object.isRequired,
};
