import React from 'react';
import EmergencyNote from '../components/EmergencyNote';

const RADIO_BUTTON_SET_LABEL =
  "Select a team from those you've sent messages to in the past 6 months. Or select A different care team to find another team.";
const OTHER_VALUE = 'other';

const RecentCareTeams = () => {
  return (
    <>
      <h1 className="vads-u-margin-bottom--3">Recent care teams</h1>
      <EmergencyNote dropDownFlag />
      <va-radio
        class="vads-u-margin-bottom--3"
        error={null}
        label={RADIO_BUTTON_SET_LABEL}
        required
      >
        <va-radio-option
          label="A different care team"
          tile
          value={OTHER_VALUE}
        />
      </va-radio>
      <va-button continue onClick={() => {}} text="Continue" />
    </>
  );
};

export default RecentCareTeams;
