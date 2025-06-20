import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import EmergencyNote from '../components/EmergencyNote';
import * as Constants from '../util/constants';
import { getRecentRecipients } from '../actions/recipients';
import { focusOnErrorField } from '../util/formHelpers';

const RADIO_BUTTON_SET_LABEL = `Select a team from those you've sent messages to in the past 6 months. Or select "A different care team" to find another team.`;
const OTHER_VALUE = 'other';
const { Paths } = Constants;

const RecentCareTeams = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedCareTeam, setSelectedCareTeam] = useState(null);
  const [error, setError] = useState(null);
  const { recipients } = useSelector(state => state.sm);
  const { recentRecipients } = recipients;

  useEffect(
    () => {
      dispatch(getRecentRecipients(6));
    },
    [dispatch],
  );

  useEffect(
    () => {
      // If recentRecipients is null (fetched but none present), redirect
      if (recentRecipients === null) {
        history.replace(`${Paths.COMPOSE}${Paths.NEW_MESSAGE}/`);
      }
    },
    [recentRecipients, history],
  );

  const handleContinue = useCallback(
    () => {
      if (!selectedCareTeam) {
        setError('Select a care team');
        focusOnErrorField();
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

  if (recentRecipients === null) {
    return null;
  }

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
        {(() => {
          if (Array.isArray(recentRecipients) && recentRecipients.length > 0) {
            return recentRecipients.map(recipient => (
              <VaRadioOption
                tile
                key={recipient.triageTeamId}
                label={recipient.name}
                value={recipient.triageTeamId}
              />
            ));
          }
          return null;
        })()}
        <VaRadioOption label="A different care team" tile value={OTHER_VALUE} />
      </VaRadio>
      <va-button continue onClick={handleContinue} text="Continue" />
    </>
  );
};

export default RecentCareTeams;
