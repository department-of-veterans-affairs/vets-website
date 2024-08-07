import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import FacilityCheckboxGroup from '../components/FacilityCheckboxGroup';
import GetFormHelp from '../components/GetFormHelp';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';
import {
  BlockedTriageAlertStyles,
  PageTitles,
  ParentComponent,
} from '../util/constants';

const EditContactList = () => {
  const [navigationError, setNavigationError] = useState(false);
  const [allTriageTeams, setAllTriageTeams] = useState([]);

  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);

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

  useEffect(
    () => {
      setAllTriageTeams(allRecipients);
    },
    [allRecipients],
  );

  useEffect(
    () => {
      if (blockedTriageGroupList.length > 0) {
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

  return (
    <div>
      <VaModal
        modalTitle="Save changes to your contact list?"
        onCloseEvent={() => {
          setNavigationError(false);
        }}
        onPrimaryButtonClick={function noRefCheck() {}}
        onSecondaryButtonClick={() => setNavigationError(false)}
        primaryButtonText="Save and exit"
        secondaryButtonText="Continue editing"
        visible={navigationError}
        status="warning"
      />

      <h1>Contact list</h1>
      <p
        className={`${
          allFacilities.length > 1 || showBlockedTriageGroupAlert
            ? 'vads-u-margin-bottom--4'
            : 'vads-u-margin-bottom--0'
        }`}
      >
        Select the teams you want to show in your contact list when you start a
        new message.{' '}
      </p>
      {showBlockedTriageGroupAlert && (
        <div
          className={`${allFacilities.length > 1 && 'vads-u-margin-bottom--4'}`}
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
                multipleFacilities={allFacilities.length > 1}
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
          />
          <va-button
            text="Cancel"
            secondary
            onClick={() => {
              setNavigationError(true);
            }}
          />
        </div>
        <GetFormHelp />
      </form>
    </div>
  );
};

export default EditContactList;
