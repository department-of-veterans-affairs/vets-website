import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import EmergencyNote from '../components/EmergencyNote';
import * as Constants from '../util/constants';
import { getRecentRecipients } from '../actions/recipients';
import { focusOnErrorField } from '../util/formHelpers';
import { updateDraftInProgress } from '../actions/threadDetails';
import useFeatureToggles from '../hooks/useFeatureToggles';

const RECENT_RECIPIENTS_LABEL = `Select a team you want to message. This list only includes teams that you’ve sent messages to in the last 6 months. If you want to contact another team, select “A different care team.”`;

const OTHER_VALUE = 'other';
const { Paths } = Constants;

const RecentCareTeams = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);
  const [selectedCareTeam, setSelectedCareTeam] = useState(null);
  const [error, setError] = useState(null);
  const { recipients, threadDetails } = useSelector(state => state.sm);
  const { acceptInterstitial } = threadDetails;
  const { recentRecipients, allRecipients } = recipients;
  const h1Ref = useRef(null);
  const {
    mhvSecureMessagingRecentRecipients,
    featureTogglesLoading,
  } = useFeatureToggles();

  useEffect(
    () => {
      if (!featureTogglesLoading && !mhvSecureMessagingRecentRecipients) {
        history.push(`${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`);
      }
    },
    [featureTogglesLoading, history, mhvSecureMessagingRecentRecipients],
  );

  useEffect(
    () => {
      if (!acceptInterstitial) history.push(`${Paths.COMPOSE}`);
    },
    [acceptInterstitial, history],
  );

  useEffect(
    () => {
      if (allRecipients?.length > 0) {
        dispatch(getRecentRecipients(6));
      }
    },
    [allRecipients, dispatch],
  );

  useEffect(
    () => {
      if (recentRecipients?.length > 0) {
        datadogRum.addAction('Recent Care Teams loaded', {
          recentCareTeamsCount: recentRecipients.length,
        });
      }
    },
    [recentRecipients],
  );

  useEffect(
    () => {
      // If recentRecipients is null (fetched but none present), redirect
      if (
        recentRecipients?.length === 0 ||
        recentRecipients?.error === 'error' ||
        recentRecipients === null
      ) {
        history.push(`${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`);
      }
    },
    [recentRecipients, history],
  );

  useEffect(
    () => {
      if (h1Ref.current && recentRecipients !== undefined) {
        h1Ref.current.focus();
      }
    },
    [recentRecipients],
  );

  useEffect(
    () => {
      document.title = `Recently Messaged Care Teams - Start Message${
        Constants.PageTitles.DEFAULT_PAGE_TITLE_TAG
      }`;
    },
    [recentRecipients],
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
        history.push(`${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`);
        return;
      }
      // TODO: CURATED LIST handle pushing selected recipient value to reducer
      // For now, just redirect to compose message
      // This is a placeholder for the actual logic to dispatch value to activeDraft redux state
      history.push(`${Paths.COMPOSE}${Paths.START_MESSAGE}`);
    },
    [history, selectedCareTeam],
  );

  const handleRadioChange = useCallback(
    event => {
      const { value } = event.detail;
      setSelectedCareTeam(value);
      const recipient = recentRecipients.find(
        r => r.triageTeamId === parseInt(value, 10),
      );
      dispatch(
        updateDraftInProgress({
          recipientId: recipient?.triageTeamId,
          careSystemName:
            recipient?.healthCareSystemName ||
            getVamcSystemNameFromVhaId(
              ehrDataByVhaId,
              recipient?.stationNumber,
            ),
          recipientName: recipient?.name,
          careSystemVhaId: recipient?.stationNumber,
          ohTriageGroup: recipient?.ohTriageGroup,
        }),
      );
      setError(null); // Clear error on selection
    },
    [recentRecipients, dispatch, ehrDataByVhaId],
  );

  if (recentRecipients === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  return (
    <>
      <h1
        id="test01"
        className="vads-u-margin-bottom--3"
        tabIndex="-1"
        ref={h1Ref}
      >
        Care teams you recently sent messages to
      </h1>
      <EmergencyNote dropDownFlag />
      <VaRadio
        class="vads-u-margin-bottom--3"
        error={error}
        label={RECENT_RECIPIENTS_LABEL}
        required
        onVaValueChange={handleRadioChange}
        data-testid="recent-care-teams-radio-group"
      >
        {Array.isArray(recentRecipients) &&
          recentRecipients.length > 0 &&
          recentRecipients.map(recipient => {
            const healthCareSystemName =
              recipient?.healthCareSystemName ||
              getVamcSystemNameFromVhaId(
                ehrDataByVhaId,
                recipient.stationNumber,
              );
            return (
              <VaRadioOption
                tile
                key={recipient.triageTeamId}
                label={recipient.name}
                value={recipient.triageTeamId}
                description={healthCareSystemName}
                data-dd-privacy="mask"
                data-dd-action-name="Recent Care Teams radio option"
              />
            );
          })}
        <VaRadioOption label="A different care team" tile value={OTHER_VALUE} />
      </VaRadio>
      <va-button
        class="vads-u-width--full small-screen:vads-u-width--auto"
        continue
        onClick={handleContinue}
        text="Continue"
        data-testid="recent-care-teams-continue-button"
      />
    </>
  );
};

export default RecentCareTeams;
