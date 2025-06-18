import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import EmergencyNote from '../components/EmergencyNote';
import * as Constants from '../util/constants';

const RADIO_BUTTON_SET_LABEL =
  "Select a team from those you've sent messages to in the past 6 months. Or select A different care team to find another team.";
const OTHER_VALUE = 'other';
const { Paths } = Constants;

const RecentCareTeams = () => {
  const history = useHistory();
  const [selectedCareTeam, setSelectedCareTeam] = useState(null);
  const [error, setError] = useState(null);

  const handleContinue = useCallback(
    () => {
      if (!selectedCareTeam) {
        setError('Select a care team');
        return;
      }
      setError(null); // Clear error on valid submit
      if (selectedCareTeam === OTHER_VALUE) {
        history.push(`${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}/`);
        return;
      }
      // TODO: CURATED LIST handle pushing selected recipient value to reducer
      // For now, just redirect to compose message
      // This is a placeholder for the actual logic to dispatch value to activeDraft redux state
      history.push(`${Paths.COMPOSE}${Paths.START_MESSAGE}/`);
    },
    [history, selectedCareTeam],
  );

  const handleRadioChange = useCallback(event => {
    const { value } = event.detail;
    setSelectedCareTeam(value);
    setError(null); // Clear error on selection
  }, []);

  return (
    <>
      <h1 className="vads-u-margin-bottom--3">Recent care teams</h1>
      <EmergencyNote dropDownFlag />
      <VaRadio
        class="vads-u-margin-bottom--3"
        error={error}
        label={RADIO_BUTTON_SET_LABEL}
        required
        onVaValueChange={handleRadioChange}
      >
        <VaRadioOption label="A different care team" tile value={OTHER_VALUE} />
      </VaRadio>
      <va-button continue onClick={handleContinue} text="Continue" />
    </>
  );
};

export default RecentCareTeams;
