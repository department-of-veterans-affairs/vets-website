import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { useHistory, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  VaAlert,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
  const [allTriageTeams, setAllTriageTeams] = useState(null);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [triageTeamCount, setTriageTeamCount] = useState({});
  const [showAlertBackgroundBox, setShowAlertBackgroundBox] = useState(false);
  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);

  const navigationError = ErrorMessages.ContactList.SAVE_AND_EXIT;

  const previousUrl = useSelector(state => state.sm.breadcrumbs.previousUrl);

  const activeDraftId = useSelector(
    state => state.sm.threadDetails?.drafts?.[0]?.messageId,
  );

  const recipients = useSelector(state => state.sm.recipients);
  const {
    vistaFacilities,
    blockedFacilities,
    vistaRecipients,
    error,
  } = recipients;

  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const isContactListChanged = useMemo(
    () => !_.isEqual(vistaRecipients, allTriageTeams),
    [vistaRecipients, allTriageTeams],
  );

  const isMinimumSelected = useMemo(
    () => _.some(allTriageTeams, { preferredTeam: true }),
    [allTriageTeams],
  );

  const setStationCount = triageTeams => {
    const teams = triageTeams || [];
    const stationNumbers = teams.map(team => team.stationNumber);
    const uniqueStationNumbers = [...new Set(stationNumbers)];
    return Object.fromEntries(
      uniqueStationNumbers.map(station => [
        station,
        teams.filter(
          team =>
            team.stationNumber === station &&
            team.preferredTeam &&
            !team.blockedStatus,
        ).length,
      ]),
    );
  };

  const updatePreferredTeam = (triageTeamId, selected, stationNumber) => {
    const updatedTriageTeams = allTriageTeams.map(
      team =>
        team.triageTeamId === triageTeamId ||
        (selected !== null && team.stationNumber === stationNumber)
          ? {
              ...team,
              preferredTeam:
                (selected || !team.preferredTeam) && selected !== false,
            }
          : team,
    );
    setAllTriageTeams(updatedTriageTeams);
    setTriageTeamCount(setStationCount(updatedTriageTeams));
  };

  const navigateBack = useCallback(
    () => {
      if (previousUrl === Paths.COMPOSE && activeDraftId) {
        history.push(`${Paths.MESSAGE_THREAD}${activeDraftId}/`);
      } else if (previousUrl) {
        history.push(previousUrl);
      } else {
        history.push(Paths.INBOX);
      }
    },
    [history, previousUrl],
  );

  const handleSave = async e => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    if (!isMinimumSelected) {
      await setCheckboxError(ErrorMessages.ContactList.MINIMUM_SELECTION);
      focusOnErrorField();
      setIsSaving(false);
    } else {
      dispatch(updateTriageTeamRecipients(allTriageTeams)).finally(() => {
        setIsSaving(false);
      });
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
      setAllTriageTeams(vistaRecipients);
      setTriageTeamCount(setStationCount(vistaRecipients));
    },
    [vistaRecipients],
  );

  useEffect(() => {
    updatePageTitle(
      `Messages: ${ParentComponent.CONTACT_LIST} ${
        PageTitles.DEFAULT_PAGE_TITLE_TAG
      }`,
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

  const GoBackButton = () => {
    if (!allTriageTeams) {
      setIsNavigationBlocked(false);
    }
    return (
      <va-button
        back
        onClick={handleCancel}
        text="Go back"
        data-testid="contact-list-go-back"
        data-dd-action-name="Go back button"
      />
    );
  };

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
      <h1>Messages: Contact list</h1>
      <AlertBackgroundBox
        closeable
        focus
        setShowAlertBackgroundBox={setShowAlertBackgroundBox}
      />

      {showBlockedTriageGroupAlert &&
        showAlertBackgroundBox && (
          <hr className="vads-u-margin-y--2" data-testid="contact-list-hr" />
        )}

      <div
        className={`${vistaFacilities?.length > 1 &&
          'vads-u-margin-bottom--2'}`}
      >
        <BlockedTriageGroupAlert
          alertStyle={BlockedTriageAlertStyles.ALERT}
          parentComponent={ParentComponent.CONTACT_LIST}
          setShowBlockedTriageGroupAlert={setShowBlockedTriageGroupAlert}
        />
      </div>

      <p className="vads-u-margin-bottom--3">
        Select and save the care teams you want to send messages to. You must
        select at least 1 care team
        {vistaFacilities?.length > 1 ? ' from 1 of your facilities.' : '.'}{' '}
        <br />
        <br />
        <b>Note:</b> You can only edit care teams from some facilities. So all
        facilities won’t be listed here.
      </p>

      {isSaving && (
        <va-loading-indicator
          message="Saving your contact list..."
          set-focus
          data-testid="contact-list-saving-indicator"
        />
      )}

      {error && (
        <div>
          <VaAlert
            role="alert"
            aria-live="polite"
            class="vads-u-margin-y--4"
            status="error"
            visible
            data-testid="contact-list-empty-alert"
          >
            <h2 className="vads-u-margin-y--0">
              We can’t load your contact list right now
            </h2>
            <p>
              We’re sorry. There’s a problem with our system. Try again later.
            </p>
            <p>
              If it still doesn’t work, call us at{' '}
              <VaTelephone contact={CONTACTS.MY_HEALTHEVET} /> (
              <VaTelephone contact={CONTACTS['711']} tty />
              ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          </VaAlert>
          <GoBackButton />
        </div>
      )}
      {allTriageTeams?.length > 0 && (
        <>
          <form className="contactListForm">
            <va-accordion bordered>
              {vistaFacilities.map((stationNumber, index) => {
                if (!blockedFacilities.includes(stationNumber)) {
                  const facilityName = getVamcSystemNameFromVhaId(
                    ehrDataByVhaId,
                    stationNumber,
                  );

                  return (
                    <va-accordion-item
                      bordered
                      class="vads-u-margin-bottom--3"
                      header={`${facilityName ||
                        `VA Medical Center - ${stationNumber}`}`}
                      subheader={`${triageTeamCount[stationNumber] || 0} team${
                        triageTeamCount[stationNumber] !== 1 ? 's' : ''
                      } selected`}
                      key={stationNumber}
                      data-dd-privacy="mask"
                      data-testid="facility-accordion-item"
                      data-dd-action-name="Contact list accordion clicked"
                      open={index === 0}
                    >
                      <FacilityCheckboxGroup
                        key={stationNumber}
                        errorMessage={checkboxError}
                        facilityName={facilityName}
                        multipleFacilities={vistaFacilities?.length > 1}
                        updatePreferredTeam={updatePreferredTeam}
                        triageTeams={allTriageTeams
                          .filter(
                            team =>
                              team.stationNumber === stationNumber &&
                              team.blockedStatus === false,
                          )
                          .sort((a, b) => {
                            const aName = a.suggestedNameDisplay || a.name;
                            const bName = b.suggestedNameDisplay || b.name;
                            return aName.localeCompare(bName);
                          })}
                      />
                    </va-accordion-item>
                  );
                }
                return null;
              })}
            </va-accordion>

            <div
              className="
                  vads-u-margin-top--3
                  vads-u-display--flex
                  vads-u-flex-direction--column
                  mobile-lg:vads-u-flex-direction--row
                  mobile-lg:vads-u-align-content--flex-start
                "
            >
              <GoBackButton />
              <va-button
                text="Save contact list"
                class="
                    vads-u-margin-y--1
                    mobile-lg:vads-u-margin-y--0
                  "
                onClick={e => handleSave(e)}
                data-testid="contact-list-save"
                data-dd-action-name="Save contact list button"
              />
            </div>
            <GetFormHelp />
          </form>
        </>
      )}
    </div>
  );
};

export default EditContactList;
