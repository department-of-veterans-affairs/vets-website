import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useSelector } from 'react-redux';
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
  // ALERT_TYPE_SUCCESS,
  // Alerts,
  BlockedTriageAlertStyles,
  ErrorMessages,
  PageTitles,
  ParentComponent,
  Paths,
} from '../util/constants';
// import { updateTriageTeamRecipients } from '../actions/recipients';
// import { addAlert } from '../actions/alerts';
// import SmRouteLeavingGuard from '../components/shared/SmRouteLeavingGuard';
import NavigationGuardTest from '../components/shared/NavigationGuardTest';

const EditContactList = () => {
  // const dispatch = useDispatch();
  const history = useHistory();
  // const [navigationError, setNavigationError] = useState(null);
  const [allTriageTeams, setAllTriageTeams] = useState([]);
  // const [modalVisible, setModalVisible] = useState(false);
  // const [bypassModal, setBypassModal] = useState(false);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);

  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);

  const draftMessageId = useSelector(
    state => state.sm?.threadDetails?.drafts[0]?.messageId,
  );

  const navigationError = ErrorMessages.ContactList.SAVE_AND_EXIT;

  const {
    allFacilities,
    blockedFacilities,
    blockedTriageGroupList,
    allRecipients,
  } = useSelector(state => {
    const { recipients } = state.sm;
    return {
      allFacilities: recipients.allFacilities,
      blockedFacilities: recipients.blockedFacilities,
      blockedTriageGroupList: recipients.blockedRecipients,
      allRecipients: recipients.allRecipients,
    };
  });

  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const isContactListChanged = useMemo(
    () => !_.isEqual(allRecipients, allTriageTeams),
    [allRecipients, allTriageTeams],
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

  // useEffect(
  //   () => {
  //     setAllTriageTeams(allRecipients);
  //   },
  //   [allRecipients],
  // );

  // useEffect(
  //   () => {
  //     if (blockedTriageGroupList.length > 0) {
  //       setShowBlockedTriageGroupAlert(true);
  //     }
  //   },
  //   [blockedTriageGroupList],
  // );

  // useEffect(() => {
  //   updatePageTitle(
  //     `${ParentComponent.CONTACT_LIST} ${PageTitles.PAGE_TITLE_TAG}`,
  //   );
  //   focusElement(document.querySelector('h1'));
  // }, []);

  // const isContactListChanged = useMemo(
  //   () => !_.isEqual(allRecipients, allTriageTeams),
  //   [allRecipients, allTriageTeams],
  // );

  // const navigateBack = useCallback(
  //   () => {
  //     if (draftMessageId) {
  //       history.push(`/thread/${draftMessageId}`);
  //     } else {
  //       history.push(Paths.INBOX);
  //     }
  //   },
  //   [draftMessageId, history],
  // );

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

  const handleSaveAndExit = e => {
    e.preventDefault();
    // setBypassModal(true);
    // setModalVisible(false);
    // dispatch(updateTriageTeamRecipients(allTriageTeams));
    // dispatch(
    //   addAlert(
    //     ALERT_TYPE_SUCCESS,
    //     null,
    //     Alerts.Message.SAVE_CONTACT_LIST_SUCCESS,
    //   ),
    // );
    navigateBack();
  };

  const handleCancel = () => {
    if (isContactListChanged) {
      // setBypassModal(false);
      // setModalVisible(true);
    } else {
      navigateBack();
    }
  };

  useEffect(
    () => {
      setAllTriageTeams(allRecipients);
    },
    [allRecipients],
  );

  useEffect(
    () => {
      if (blockedTriageGroupList?.length > 0) {
        setShowBlockedTriageGroupAlert(true);
      }
    },
    [blockedTriageGroupList],
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

  return (
    <div>
      {/* <SmRouteLeavingGuard
        when={NavigationError?.confirmButtonText}
        cancelButtonText={navictListChanged}
        title={navigationError?.title}
        confirmButtonText={nagationError?.cancelButtonText}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        swapModalButtons
        onConfirmNavigation={handleModalConfirm}
        onCancelNavigation={handleModalCancel}
        bypassModal={bypassModal}
        // parentComponent={ParentComponent.CONTACT_LIST}
      /> */}

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
            blockedTriageGroupList={blockedTriageGroupList}
            alertStyle={BlockedTriageAlertStyles.ALERT}
            parentComponent={ParentComponent.CONTACT_LIST}
          />
        </div>
      )}
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

        <NavigationGuardTest
          when={isNavigationBlocked}
          onConfirmNavigation={handleSaveAndExit}
          modalTitle={navigationError?.title}
          confirmButtonText={navigationError?.confirmButtonText}
          cancelButtonText={navigationError?.cancelButtonText}
        />

        <div
          className="
            vads-u-margin-top--3
            vads-u-display--flex
            vads-u-flex-direction--column
            small-screen:vads-u-flex-direction--row
            small-screen:vads-u-align-content--flex-start
          "
        >
          {/* <va-button
            text="Save and exit"
            class="
              vads-u-margin-bottom--1
              small-screen:vads-u-margin-bottom--0
            "
            onClick={handleSaveAndExit}
          />
          <va-button text="Cancel" secondary onClick={handleCancel} /> */}
          <button
            text="Save and exit"
            className="
              vads-u-margin-bottom--1
              small-screen:vads-u-margin-bottom--0
            "
            onClick={handleSaveAndExit}
          >
            Save and exit
          </button>
          <button
            text="Cancel"
            className="usa-button usa-button-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        <GetFormHelp />
      </form>
    </div>
  );
};

export default EditContactList;
