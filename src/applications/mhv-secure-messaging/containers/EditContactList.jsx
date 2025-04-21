import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
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

  const navigationError = ErrorMessages.ContactList.SAVE_AND_EXIT;

  const previousUrl = useSelector(state => state.sm.breadcrumbs.previousUrl);

  const activeDraftId = useSelector(
    state => state.sm.threadDetails?.drafts?.[0]?.messageId,
  );

  const recipients = useSelector(state => state.sm.recipients);
  const { allFacilities, blockedFacilities, allRecipients, error } = recipients;

  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const removeLandingPageFF = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingRemoveLandingPage
      ],
  );

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
      setAllTriageTeams(allRecipients);
    },
    [allRecipients],
  );

  useEffect(() => {
    updatePageTitle(
      `${removeLandingPageFF ? 'Messages: ' : ''}${
        ParentComponent.CONTACT_LIST
      } ${
        removeLandingPageFF
          ? PageTitles.NEW_MESSAGE_PAGE_TITLE_TAG
          : PageTitles.PAGE_TITLE_TAG
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
      <button
        type="button"
        className={`
          ${allTriageTeams?.length ? 'usa-button-secondary' : ''}
          vads-u-display--flex
          vads-u-flex-direction--row
          vads-u-justify-content--center
          vads-u-align-items--center
          vads-u-margin-y--0
        `}
        data-testid="contact-list-go-back"
        data-dd-action-name="Go back button"
        onClick={handleCancel}
      >
        <div className="vads-u-margin-right--0p5">
          <va-icon icon="navigate_far_before" aria-hidden="true" />
        </div>
        <span>Go back</span>
      </button>
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
      <h1>{`${removeLandingPageFF ? `Messages: ` : ''}Contact list`}</h1>
      <AlertBackgroundBox closeable focus />

      <div
        className={`${allFacilities?.length > 1 && 'vads-u-margin-bottom--2'}`}
      >
        <BlockedTriageGroupAlert
          alertStyle={BlockedTriageAlertStyles.ALERT}
          parentComponent={ParentComponent.CONTACT_LIST}
        />
      </div>

      <p className="vads-u-margin-bottom--3">
        Select the teams you want to show in your contact list. You must select
        at least one team
        {allFacilities?.length > 1 ? ' from one of your facilities.' : '.'}{' '}
      </p>

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
                      .sort((a, b) => {
                        const aName = a.suggestedNameDisplay || a.name;
                        const bName = b.suggestedNameDisplay || b.name;
                        return aName.localeCompare(bName);
                      })}
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
