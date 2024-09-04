import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import FacilityCheckboxGroup from '../components/FacilityCheckboxGroup';
import GetFormHelp from '../components/GetFormHelp';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';
import {
  ALERT_TYPE_SUCCESS,
  Alerts,
  BlockedTriageAlertStyles,
  ErrorMessages,
  PageTitles,
  ParentComponent,
  Paths,
} from '../util/constants';
import { updateTriageTeamRecipients } from '../actions/recipients';
import { addAlert } from '../actions/alerts';
import SmRouteNavigationGuard from '../components/shared/SmRouteNavigationGuard';
import { focusOnErrorField } from '../util/formHelpers';

const EditContactList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allTriageTeams, setAllTriageTeams] = useState([]);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');

  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);

  const draftMessageId = useSelector(
    state => state.sm?.threadDetails?.drafts[0]?.messageId,
  );

  const navigationError = ErrorMessages.ContactList.SAVE_AND_EXIT;

  const recipients = useSelector(state => state.sm.recipients);
  const {
    allFacilities,
    blockedFacilities,
    blockedRecipients,
    allRecipients,
  } = recipients;

  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const isContactListChanged = useMemo(
    () => !_.isEqual(allRecipients, allTriageTeams),
    [allRecipients, allTriageTeams],
  );

  const isMinimumSelected = useMemo(
    () => _.some(allTriageTeams, { preferredTeam: true }),
    [allTriageTeams],
  );

  const navigateBack = useCallback(
    () => {
      if (draftMessageId) {
        history.push(`/thread/${draftMessageId}`);
      } else {
        history.push(Paths.INBOX);
      }
    },
    [draftMessageId, history],
  );

  const updatePreferredTeam = (triageTeamId, selected) => {
    setAllTriageTeams(prevTeams =>
      prevTeams.map(
        team =>
          team.triageTeamId === triageTeamId
            ? {
                ...team,
                preferredTeam: selected || !team.preferredTeam,
              }
            : team,
      ),
    );
  };

  const handleSaveAndExit = async (e, forceSave) => {
    e.preventDefault();
    if (!isMinimumSelected) {
      await setCheckboxError(ErrorMessages.ContactList.MINIMUM_SELECTION);
      focusOnErrorField();
    } else {
      if (forceSave) {
        await setIsNavigationBlocked(false);
      }

      if (forceSave || !isNavigationBlocked) {
        dispatch(updateTriageTeamRecipients(allTriageTeams));
        dispatch(
          addAlert(
            ALERT_TYPE_SUCCESS,
            null,
            Alerts.Message.SAVE_CONTACT_LIST_SUCCESS,
          ),
        );
      }
      navigateBack();
    }
  };

  const handleCancel = e => {
    e.preventDefault();
    navigateBack();
  };

  useEffect(
    () => {
      setAllTriageTeams(allRecipients);
    },
    [allRecipients],
  );

  useEffect(
    () => {
      if (blockedRecipients?.length > 0) {
        setShowBlockedTriageGroupAlert(true);
      }
    },
    [blockedRecipients],
  );

  useEffect(() => {
    updatePageTitle(
      `${ParentComponent.CONTACT_LIST} ${PageTitles.PAGE_TITLE_TAG}`,
    );
    focusElement(document.querySelector('h1'));
  }, []);

  useEffect(
    () => {
      setIsNavigationBlocked(isContactListChanged);
    },
    [isContactListChanged],
  );

  useEffect(
    () => {
      if (isMinimumSelected) {
        setCheckboxError('');
      }
    },
    [isMinimumSelected],
  );

  return (
    <div>
      <SmRouteNavigationGuard
        when={isNavigationBlocked}
        onConfirmNavigation={handleSaveAndExit}
        modalTitle={navigationError?.title}
        confirmButtonText={navigationError?.confirmButtonText}
        cancelButtonText={navigationError?.cancelButtonText}
      />

      <h1>Contact list</h1>
      <p
        className={`${
          allFacilities?.length > 1 || showBlockedTriageGroupAlert
            ? 'vads-u-margin-bottom--4'
            : 'vads-u-margin-bottom--0'
        }`}
      >
        Select the teams you want to show in your contact list when you start a
        new message.{' '}
      </p>
      {showBlockedTriageGroupAlert && (
        <div
          className={`${allFacilities?.length > 1 &&
            'vads-u-margin-bottom--4'}`}
        >
          <BlockedTriageGroupAlert
            blockedTriageGroupList={blockedRecipients}
            alertStyle={BlockedTriageAlertStyles.ALERT}
            parentComponent={ParentComponent.CONTACT_LIST}
          />
        </div>
      )}
      {allTriageTeams.length > 0 && (
        <form className="contactListForm">
          {allFacilities.map(stationNumber => {
            if (!blockedFacilities.includes(stationNumber)) {
              const facilityName = getVamcSystemNameFromVhaId(
                ehrDataByVhaId,
                stationNumber,
              );

              return (
                <FacilityCheckboxGroup
                  key={stationNumber}
                  errorMessage={checkboxError}
                  facilityName={facilityName}
                  multipleFacilities={allFacilities?.length > 1}
                  updatePreferredTeam={updatePreferredTeam}
                  triageTeams={allTriageTeams
                    .filter(
                      team =>
                        team.stationNumber === stationNumber &&
                        team.blockedStatus === false,
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))}
                />
              );
            }
            return null;
          })}

          <div
            className="
            vads-u-margin-top--3
            vads-u-display--flex
            vads-u-flex-direction--column
            small-screen:vads-u-flex-direction--row
            small-screen:vads-u-align-content--flex-start
          "
          >
            <va-button
              text="Save and exit"
              class="
              vads-u-margin-bottom--1
              small-screen:vads-u-margin-bottom--0
            "
              onClick={e => handleSaveAndExit(e, true)}
              data-testid="contact-list-save-and-exit"
            />
            <va-button
              text="Cancel"
              secondary
              onClick={handleCancel}
              data-testid="contact-list-cancel"
            />
          </div>
          <GetFormHelp />
        </form>
      )}
    </div>
  );
};

export default EditContactList;
