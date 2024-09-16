import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { useHistory, useLocation } from 'react-router-dom';
import _ from 'lodash';
import FacilityCheckboxGroup from '../components/FacilityCheckboxGroup';
import GetFormHelp from '../components/GetFormHelp';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';
import {
  BlockedTriageAlertStyles,
  ErrorMessages,
  PageTitles,
  ParentComponent,
  Paths,
} from '../util/constants';
import { updateTriageTeamRecipients } from '../actions/recipients';
import SmRouteNavigationGuard from '../components/shared/SmRouteNavigationGuard';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { focusOnErrorField } from '../util/formHelpers';
import { closeAlert } from '../actions/alerts';

const EditContactList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [allTriageTeams, setAllTriageTeams] = useState([]);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');

  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);

  const navigationError = ErrorMessages.ContactList.SAVE_AND_EXIT;

  const previousUrl = useSelector(state => state.sm.breadcrumbs.previousUrl);

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

  const navigateBack = useCallback(
    () => {
      if (previousUrl) {
        history.push(previousUrl);
      } else {
        history.push(Paths.INBOX);
      }
    },
    [history, previousUrl],
  );

  const handleSave = async e => {
    e.preventDefault();
    if (!isMinimumSelected) {
      await setCheckboxError(ErrorMessages.ContactList.MINIMUM_SELECTION);
      focusOnErrorField();
    } else {
      dispatch(updateTriageTeamRecipients(allTriageTeams));
    }
  };

  const handleCancel = e => {
    e.preventDefault();
    navigateBack();
  };

  useEffect(
    () => {
      return () => {
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [location.pathname, dispatch],
  );

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
      if (isContactListChanged) {
        dispatch(closeAlert());
      }
      setIsNavigationBlocked(isContactListChanged);
    },
    [dispatch, isContactListChanged],
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
        onConfirmButtonClick={handleSave}
        onCancelButtonClick={handleCancel}
        modalTitle={navigationError?.title}
        confirmButtonText={navigationError?.confirmButtonText}
        cancelButtonText={navigationError?.cancelButtonText}
      />

      <h1>Contact list</h1>
      <AlertBackgroundBox closeable focus />
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
      {allFacilities.length > 0 && (
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
              text="Save contact list"
              class="
              vads-u-margin-bottom--1
              small-screen:vads-u-margin-bottom--0
            "
              onClick={e => handleSave(e)}
              data-testid="contact-list-save"
              data-dd-action-name="Contct List Save Button"
            />
            <button
              type="button"
              className="
              usa-button-secondary
              vads-u-display--flex
              vads-u-flex-direction--row
              vads-u-justify-content--center
              vads-u-align-items--center
              vads-u-margin-y--0
              "
              data-testid="contact-list-go-back"
              data-dd-action-name="Contact List Go Back Button"
              onClick={handleCancel}
            >
              <div className="vads-u-margin-right--0p5">
                <va-icon icon="navigate_far_before" aria-hidden="true" />
              </div>
              <span>Go back</span>
            </button>
          </div>
          <GetFormHelp />
        </form>
      )}
    </div>
  );
};

export default EditContactList;
