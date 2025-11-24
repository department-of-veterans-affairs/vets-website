import React, { useState } from 'react';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

export default function SelectPreferenceView({
  setSelectedPreference,
  PREFERENCE_OPTION,
}) {
  const [preferenceRadioValue, setPreferenceRadioValue] = useState();
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
        onVaValueChange={e => setPreferenceRadioValue(e.detail.value)}
      >
        <VaRadioOption
          label={PREFERENCE_OPTION.SCHEDULE_MEETING}
          name="preference"
          value={PREFERENCE_OPTION.SCHEDULE_MEETING}
        />
        <VaRadioOption
          label={PREFERENCE_OPTION.WATCH_VIDEO}
          name="preference"
          value={PREFERENCE_OPTION.WATCH_VIDEO}
        />
      </VaRadio>
      <VaButton
        onClick={() => setSelectedPreference(preferenceRadioValue)}
        disabled={!preferenceRadioValue}
        text="Submit"
      />
    </>
  );
}

SelectPreferenceView.propTypes = {
  setSelectedPreference: PropTypes.func.isRequired,
  PREFERENCE_OPTION: PropTypes.object.isRequired,
};
