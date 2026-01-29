import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import EmergencyNote from '../components/EmergencyNote';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';
import * as Constants from '../util/constants';
import { BlockedTriageAlertStyles, ParentComponent } from '../util/constants';
import { getRecentRecipients } from '../actions/recipients';
import { focusOnErrorField } from '../util/formHelpers';
import { updateDraftInProgress } from '../actions/threadDetails';
import useFeatureToggles from '../hooks/useFeatureToggles';
import manifest from '../manifest.json';

const RECENT_RECIPIENTS_LABEL = 'Select a team you want to message';
const RECENT_RECIPIENTS_HINT = `This list only includes teams that you've sent messages to in the last 6 months. If you want to contact another team, select "A different care team."`;

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
  const {
    recentRecipients,
    allRecipients,
    noAssociations,
    allTriageGroupsBlocked,
    blockedFacilities,
    error: recipientsError,
  } = recipients;
  const h1Ref = useRef(null);
  const {
    mhvSecureMessagingRecentRecipients,
    featureTogglesLoading,
  } = useFeatureToggles();

  useEffect(
    () => {
      if (recipientsError || noAssociations) {
        history.push(Paths.INBOX);
      }
    },
    [recipientsError, noAssociations, history],
  );

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
      if (allRecipients?.length > 0 && recentRecipients === undefined) {
        dispatch(getRecentRecipients(6));
      }
    },
    [allRecipients, dispatch, recentRecipients],
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

  const getDestinationPath = useCallback(
    (includeRootUrl = false) => {
      const selectCareTeamPath = `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`;
      const startPath = `${Paths.COMPOSE}${Paths.START_MESSAGE}`;
      let path;
      if (selectedCareTeam === OTHER_VALUE) {
        path = selectCareTeamPath;
      } else {
        path = startPath;
      }
      return includeRootUrl ? `${manifest.rootUrl}${path}` : path;
    },
    [selectedCareTeam],
  );

  const handleContinue = useCallback(
    event => {
      event?.preventDefault();
      if (!selectedCareTeam) {
        setError('Select a care team');
        focusOnErrorField();
        return;
      }
      setError(null); // Clear error on valid submit
      history.push(getDestinationPath());
    },
    [history, selectedCareTeam, getDestinationPath],
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
      recordEvent({
        event: 'int-select-box-option-click',
        'select-label': RECENT_RECIPIENTS_LABEL,
        'select-selectLabel':
          value === OTHER_VALUE ? OTHER_VALUE : 'recent care team',
        'select-required': true,
      });
    },
    [recentRecipients, dispatch, ehrDataByVhaId],
  );

  if (recentRecipients === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (allTriageGroupsBlocked) {
    return (
      <>
        <h1 className="vads-u-margin-bottom--3" tabIndex="-1" ref={h1Ref}>
          Care teams you recently sent messages to
        </h1>
        <BlockedTriageGroupAlert
          alertStyle={BlockedTriageAlertStyles.ALERT}
          parentComponent={ParentComponent.FOLDER_HEADER}
        />
      </>
    );
  }

  const showSingleFacilityBlockedAlert =
    blockedFacilities?.length === 1 && !allTriageGroupsBlocked;

  return (
    <>
      <h1 className="vads-u-margin-bottom--3" tabIndex="-1" ref={h1Ref}>
        Care teams you recently sent messages to
      </h1>
      {showSingleFacilityBlockedAlert && (
        <BlockedTriageGroupAlert
          alertStyle={BlockedTriageAlertStyles.INFO}
          parentComponent={ParentComponent.FOLDER_HEADER}
        />
      )}
      <EmergencyNote dropDownFlag />
      <VaRadio
        class="vads-u-margin-bottom--3"
        error={error}
        label={RECENT_RECIPIENTS_LABEL}
        hint={RECENT_RECIPIENTS_HINT}
        label-header-level="2"
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

      <va-link-action
        href={getDestinationPath(true)}
        text="Continue to start message"
        data-testid="recent-care-teams-continue-button"
        onClick={handleContinue}
        class="vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-with--100"
        type="primary"
      />
    </>
  );
};

export default RecentCareTeams;
